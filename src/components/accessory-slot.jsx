/* Copyright (C) 2016, Ole Krüger <ole@vprsm.de> */

"use strict";

import React, {Component} from "react";
import RuneSlot from "./rune-slot.jsx";
import Item from "./item.jsx";
import StatDisplay from "./stat-display.jsx";
import ItemSelector from "./item-selector.jsx";
import AppStore from "../app-store.jsx";
import Items from "../database/items.jsx";
import Overlay from "../utilities/overlay.jsx";

export default class AccessorySlot extends Component {
	constructor(props) {
		super(props);

		this.state = {
			item: AppStore.getState().loadout[props.itemSlot].item
		};
	}

	componentDidMount() {
		this.storeLease = AppStore.subscribe(
			() => {
				this.setState({
					item: AppStore.getState().loadout[this.props.itemSlot].item
				});
			}
		);
	}

	render() {
		const title = this.props.itemSlot[0].toUpperCase() + this.props.itemSlot.substring(1);

		return (
			<div className="item-slot">
				<div className="headline">{title}</div>
				<Item itemSlot={this.props.itemSlot} />
			</div>
		);
	}
}