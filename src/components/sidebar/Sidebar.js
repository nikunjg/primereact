import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DomHandler from '../utils/DomHandler';

export class Sidebar extends Component {

    static defaultProps = {
        id: null,
        style: null,
        className: null,
        visible: false,
        position: 'left',
        fullScreen: false,
        blockScroll: false,
        baseZIndex: 0,
        dismissable: true,
        showCloseIcon: true,
        iconsTemplate: null,
        modal: true,
        onShow: null,
        onHide: null
    };

    static propTypes = {
        id: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        visible: PropTypes.bool,
        position: PropTypes.string,
        fullScreen: PropTypes.bool,
        blockScroll: PropTypes.bool,
        baseZIndex: PropTypes.number,
        dismissable: PropTypes.bool,
        showCloseIcon: PropTypes.bool,
        iconsTemplate: PropTypes.element,
        modal: PropTypes.bool,
        onShow: PropTypes.func,
        onHide: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.onCloseClick = this.onCloseClick.bind(this);
    }

    componentDidMount() {
        if (this.props.visible) {
            this.onShow();
        }
    }

    componentWillUnmount() {
        this.unbindMaskClickListener();
        this.disableModality();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.visible !== this.props.visible) {
            if (this.props.visible)
                this.onShow();
            else
                this.onHide();
        }
    }

    onShow() {
        this.container.style.zIndex = String(this.props.baseZIndex + DomHandler.generateZIndex());

        if (this.props.modal) {
            this.enableModality();
        }

        if (this.closeIcon) {
            this.closeIcon.focus();
        }

        if (this.props.onShow) {
            this.props.onShow();
        }
    }

    enableModality() {
        if (!this.mask) {
            this.mask = document.createElement('div');
            this.mask.style.zIndex = String(parseInt(this.container.style.zIndex, 10) - 1);
            DomHandler.addMultipleClasses(this.mask, 'p-component-overlay p-sidebar-mask');
            if (this.props.dismissable) {
                this.bindMaskClickListener();
            }

            document.body.appendChild(this.mask);

            if (this.props.blockScroll) {
                DomHandler.addClass(document.body, 'p-overflow-hidden');
            }
        }
    }

    disableModality() {
        if (this.mask) {
            this.unbindMaskClickListener();
            document.body.removeChild(this.mask);
            if (this.props.blockScroll) {
                DomHandler.removeClass(document.body, 'p-overflow-hidden');
            }
            this.mask = null;
        }
    }

    onCloseClick(event) {
        this.props.onHide();
        event.preventDefault();
    }

    onHide() {
        this.unbindMaskClickListener();

        if (this.props.modal) {
            this.disableModality();
        }
    }

    bindMaskClickListener() {
        if (!this.maskClickListener) {
            this.maskClickListener = (event) => {
                this.onCloseClick(event);
            };
            this.mask.addEventListener('click', this.maskClickListener);
        }
    }

    unbindMaskClickListener() {
        if (this.maskClickListener) {
            this.mask.removeEventListener('click', this.maskClickListener);
            this.maskClickListener = null;
        }
    }

    renderCloseIcon() {
        if (this.props.showCloseIcon) {
            return (
                <button ref={el => this.closeIcon = el} className="p-sidebar-close p-link" onClick={this.onCloseClick}>
                    <span className="p-sidebar-close-icon pi pi-times"/>
                </button>
            );
        }
        else {
            return null;
        }
    }

    renderIconsTemplate() {
        if (this.props.iconsTemplate) {
            return this.props.iconsTemplate(this);
        }
        else {
            return null;
        }
    }

    render() {
        const className = classNames('p-sidebar p-component', this.props.className, 'p-sidebar-' + this.props.position,
                                       {'p-sidebar-active': this.props.visible, 'p-sidebar-full': this.props.fullScreen});
        const closeIcon = this.renderCloseIcon();
        const iconsTemplate = this.renderIconsTemplate();

        return (
            <div ref={(el) => this.container=el} id={this.props.id} className={className} style={this.props.style}>
                {closeIcon}
                {iconsTemplate}
                {this.props.children}
            </div>
        );
    }
}
