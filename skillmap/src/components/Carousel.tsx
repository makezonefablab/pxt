import * as React from "react";

import { Item, CarouselItem } from './CarouselItem';

import '../styles/carousel.css'
import { ComponentClass } from "react-redux";

interface CarouselProps {
    title?: string;
    titleIcon?: string;
    titleDecoration?: JSX.Element;
    items: Item[];
    selectedItem?: string;
    itemClassName?: string;
    itemTemplate?: ((props: Item) => JSX.Element) | ComponentClass<any>;
    onItemSelect?: (id: string) => void;
    prependChildren?: JSX.Element[];
    appendChildren?: JSX.Element[];
}

interface CarouselState {
    showLeft: boolean;
    showRight: boolean;
}

export class Carousel extends React.Component<CarouselProps, CarouselState> {
    protected scrollMargin = 5;
    protected carouselRef: any;
    constructor(props: CarouselProps) {
        super(props);

        this.state = { showLeft: false, showRight: true };
    }

    componentDidMount() {
        this.handleScroll();
        window.addEventListener("resize", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleScroll);
    }

    scrollTo = (left: number) => {
        this.carouselRef.scrollTo(left, 0);
    }

    protected handleLeftArrowClick = () => {
        this.carouselRef.scrollBy({ left: - (window.innerWidth / 2) });
    }

    protected handleRightArrowClick = () => {
        this.carouselRef.scrollBy({ left: window.innerWidth / 2 });
    }

    protected handleScroll = () => {
        const scrollLeft = this.carouselRef.scrollLeft;
        this.setState({
            showLeft: scrollLeft > this.scrollMargin,
            showRight: ((this.carouselRef.scrollWidth - this.carouselRef.clientWidth) - scrollLeft) > this.scrollMargin
        });
    }

    render() {
        const {
            title,
            items,
            selectedItem,
            itemTemplate,
            itemClassName,
            onItemSelect,
            prependChildren,
            appendChildren,
            titleIcon,
            titleDecoration
        } = this.props;
        const { showLeft, showRight } = this.state;

        return <div className="carousel">
            {title && <div className="carousel-title">
                {titleIcon && <i className={`icon ${titleIcon}`} />}
                <span>{title}</span>
                {titleDecoration && <span className="carousel-subtitle">{titleDecoration}</span>}
            </div>}
            {showLeft && <div className="carousel-arrow left" onClick={this.handleLeftArrowClick}>
                <i className="icon chevron left" />
            </div>}
            <div className="carousel-items">
                <div className="carousel-items-inner" onScroll={this.handleScroll} ref={(el) => this.carouselRef = el}>
                    {prependChildren}
                    {items.map((el, i) => {
                        return <CarouselItem key={i} className={itemClassName} item={el} itemTemplate={itemTemplate} selected={selectedItem === el.id} onSelect={onItemSelect} />
                    })}
                    {appendChildren}
                </div>
            </div>
            {showRight && <div className="carousel-arrow right" onClick={this.handleRightArrowClick}>
                <i className="icon chevron right" />
            </div>}
        </div>
    }
}
