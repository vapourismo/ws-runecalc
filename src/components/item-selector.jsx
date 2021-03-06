/* Copyright (C) 2016, Ole Krüger <ole@vprsm.de> */

"use strict";

import React, {Component} from "react";
import RatingsTable from "./ratings-table.jsx";
import Option from "./option.jsx";
import AppStore from "../app-store.jsx";
import Items from "../database/items.jsx";
import Overlay from "../utilities/overlay.jsx";

function itemMatchesClass(item, klass) {
	if (!klass || item.type == null)
		return true;

	if (item.klass == null)
		switch (klass) {
			case "Spellslinger":
				return item.type === "Light" || item.type === "Pistols";

			case "Esper":
				return item.type === "Light" || item.type === "Psyblade";

			case "Medic":
				return item.type === "Medium" || item.type === "Resonators";

			case "Stalker":
				return item.type === "Medium" || item.type === "Claws";

			case "Warrior":
				return item.type === "Heavy" || item.type === "Greatsword";

			case "Engineer":
				return item.type === "Heavy" || item.type === "Heavy Gun";
		}

	return item.klass === klass;
}

function itemMatchesRole(item, role) {
	const ap = item.ratings["Assault Rating"] || 0;
	const sp = item.ratings["Support Rating"] || 0;

	switch (role) {
		case "Assault":
			return ap >= sp;

		case "Support":
			return sp >= ap;

		default:
			return true;
	}
}

export default class ItemSelector extends Component {
	static show(itemSlot, otherItem) {
		Overlay.show(<ItemSelector itemSlot={itemSlot} otherItem={otherItem} />);
	}

	constructor(props) {
		super(props);

		const filters = AppStore.getState().filters;

		this.state = {
			klass: filters.klass,
			role: filters.role
		};
	}

	componentDidMount() {
		this.storeLease = AppStore.subscribeTo(
			["filters"],
			filters => {
				this.setState({
					klass: filters.klass,
					role: filters.role
				});
			}
		);
	}

	componentWillUnmount() {
		if (this.storeLease) this.storeLease();
	}

	selectItem(itemID) {
		AppStore.dispatch({type: "select_item", itemSlot: this.props.itemSlot, itemID});
		Overlay.hide();
	}

	renderItem(item, itemID) {
		return (
			<div key={itemID} className="item" onClick={() => this.selectItem(itemID)}>
				<div className="item-info">
					<div className="item-name">{item.name}</div>
					<div className="item-detail">
						{item.level} {item.type}
					</div>
				</div>
				<RatingsTable
					ratings={item.ratings}
					otherRatings={
						(this.props.otherItem && this.props.otherItem in Items)
						? Items[this.props.otherItem].ratings
						: undefined
					} />
			</div>
		);
	}

	render() {
		const availableItems = [];

		for (let itemID in Items) {
			let item = Items[itemID];

			if (item.slot === this.props.itemSlot && itemMatchesClass(item, this.state.klass) && itemMatchesRole(item, this.state.role))
				availableItems.push(this.renderItem(item, itemID));
		}

		return (
			<div className="item-selector">
				<div className="items">
					{availableItems}
				</div>
			</div>
		);
	}
}
