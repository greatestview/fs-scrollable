import { LitElement, html, css } from 'lit';

class FsScrollable extends LitElement {
  static styles = css`
    :host {
      position: relative;
    }

    ::slotted(*) {
      min-width: fit-content;
      width: 100%;
    }

    button {
      align-items: center;
      appearance: none;
      background: transparent;
      block-size: 100%;
      border: 0;
      display: flex;
      inline-size: 100%;
      margin: 0;
      padding: 0;
    }

    svg {
      block-size: var(--fs-scrollable--image-size, 24px);
      inline-size: var(--fs-scrollable--image-size, 24px);
    }

    .button--left {
      cursor: w-resize;
      justify-content: flex-start;
    }

    .button--right {
      cursor: e-resize;
      justify-content: flex-end;
    }

    :host([hide-buttons]) .button {
      display: none;
    }

    .overlay {
      --_gradient-start: color-mix(
        in srgb,
        var(--fs-scrollable--background-color, white) 0%,
        transparent
      );
      --_gradient-middle: color-mix(
        in srgb,
        var(--fs-scrollable--background-color, white) 80%,
        transparent
      );
      --_gradient-end: color-mix(
        in srgb,
        var(--fs-scrollable--background-color, white) 100%,
        transparent
      );
      align-items: center;
      background: linear-gradient(
        var(--_deg),
        var(--_gradient-start) 0%,
        var(--_gradient-middle) 50%,
        var(--_gradient-end) 100%
      );
      display: flex;
      height: 100%;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      top: 0;
      transition: opacity ease-out var(--fs-scrollable--transition-speed, 0.1s);
      width: var(--fs-scrollable--gradient-width, 20px);
      z-index: 10;
    }

    :host([hide-gradients]) .overlay {
      display: none;
    }

    .overlay path {
      fill: var(--fs-scrollable--color-text, black);
    }

    .overlay--left {
      --_deg: 270deg;
      left: 0;
    }

    .overlay--right {
      --_deg: 90deg;
      right: 0;
    }

    .overlay--visible {
      opacity: 1;
    }

    :host(:not([hide-buttons])) .overlay--visible {
      pointer-events: all;
    }

    .anchor {
      flex-grow: 0;
      flex-shrink: 0;
      height: 0px;
      width: 0px;
      pointer-events: none;
      position: relative;
    }

    /* Move anchor a bit to the inside, so that observer definitely gets triggered. */
    .anchor--left {
      left: 1px;
    }

    /* Move anchor a bit to the inside, so that observer definitely gets triggered. */
    .anchor--right {
      right: 1px;
    }

    :host([hide-gradients]) .anchor {
      display: none;
    }

    .scrollable {
      display: flex;
      overflow-x: auto;
      position: relative; /* w/o this there is some strange overflow in Chromium */
      scrollbar-width: none;
      width: 100%;
    }
  `;

  // Define private state properties.
  static properties = {
    hideButtons: { type: Boolean, attribute: 'hide-buttons', reflect: true },
    hideGradients: { type: Boolean, attribute: 'hide-gradients', reflect: true },
    _scrolledToMostLeft: { state: true },
    _scrolledToMostRight: { state: false },
  };

  constructor() {
    super();
    this.hideButtons = false;
    this.hideGradients = false;
    this._scrolledToMostLeft = true;
    this._scrolledToMostRight = true;
  }

  firstUpdated() {
    this.scrollable = this.shadowRoot.querySelector('.scrollable');
    this.overlayLeft = this.shadowRoot.querySelector('.overlay--left');
    this.overlayRight = this.shadowRoot.querySelector('.overlay--right');
    this.anchorLeft = this.shadowRoot.querySelector('.anchor--left');
    this.anchorRight = this.shadowRoot.querySelector('.anchor--right');
    this.buttonLeft = this.shadowRoot.querySelector('.button--left');
    this.buttonRight = this.shadowRoot.querySelector('.button--right');

    if (!this.hideGradients) {
      // Toggle visible class on overlays based on intersection.
      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          switch (entry.target) {
            case this.anchorLeft:
              this._scrolledToMostLeft = entry.isIntersecting;
              this.overlayLeft.classList.toggle('overlay--visible', !this._scrolledToMostLeft);
              break;
            case this.anchorRight:
              this._scrolledToMostRight = entry.isIntersecting;
              this.overlayRight.classList.toggle('overlay--visible', !this._scrolledToMostRight);
              break;
          }
        });
      };

      this.observer = new IntersectionObserver(observerCallback, {
        root: this.scrollable,
        threshold: 1.0,
      });
      this.observer.observe(this.anchorLeft);
      this.observer.observe(this.anchorRight);

      if (!this.hideButtons) {
        // Add click listener to buttons, which scrolls the content.
        const scrollMe = (direction) => {
          // Scroll by half of the container width.
          const scrollBy = this.scrollable.clientWidth / 2;
          this.scrollable.scrollBy({ left: direction * scrollBy, behavior: 'smooth' });
        };
        this.buttonLeft.addEventListener('click', () => scrollMe(-1));
        this.buttonRight.addEventListener('click', () => scrollMe(1));
      }
    }
  }

  render() {
    return html`
      <div>
        <div class="overlay overlay--left">
          <button class="button button--left">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
              <path
                d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"
              ></path>
            </svg>
          </button>
        </div>
        <div class="overlay overlay--right">
          <button class="button button--right">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
              <path
                d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"
              ></path>
            </svg>
          </button>
        </div>
        <div class="scrollable">
          <div class="anchor anchor--left"></div>
          <slot></slot>
          <div class="anchor anchor--right"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('fs-scrollable', FsScrollable);
