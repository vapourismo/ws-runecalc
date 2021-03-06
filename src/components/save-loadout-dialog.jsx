/* Copyright (C) 2016, Ole Krüger <ole@vprsm.de> */

"use strict";

import React, {Component} from "react";
import Storage from "../utilities/storage.jsx";
import Overlay from "../utilities/overlay.jsx";
import AppStore from "../app-store.jsx";

export default class SaveLoadoutDialog extends Component {
	static show() {
		Overlay.show(<SaveLoadoutDialog />);
	}

	constructor(props) {
		super(props);

		this.profiles = Storage.loadProfiles() || {};

		this.saveLoadout = this.saveLoadout.bind(this);
	}

	saveLoadout() {
		if (this.inputCom && this.inputCom.value != "")
			this.overrideLoadout(this.inputCom.value);
		else if (this.inputCom)
			this.inputCom.focus();
	}

	overrideLoadout(name) {
		const appState = AppStore.getState();

		this.profiles[name] = {
			loadout: appState.loadout,
			filters: appState.filters,
			amps: appState.amps
		};

		if (!Storage.saveProfiles(this.profiles))
			console.error("Storage rejected saving profiles:", this.profiles);

		Overlay.hide();
	}

	render() {
		const names = Object.keys(this.profiles);
		let loadouts;

		if (names.length > 0)
			loadouts = names.map(name => (
				<div key={name} className="loadout" onClick={() => this.overrideLoadout(name)}>
					{name}
				</div>
			));
		else
			loadouts = <div className="empty-message">Empty list</div>;

		return (
			<div className="save-loadout-dialog">
				<div className="existing-loadouts">
					<div className="headline">Override existing loadout</div>
					{loadouts}
				</div>
				<div className="new-loadout">
					<div className="headline">Create new loadout</div>
					<input
						className="text-input"
						type="text"
						ref={com => this.inputCom = com}
						placeholder="Type name here" />
					<div className="submit" onClick={this.saveLoadout}>Save</div>
				</div>
			</div>
		);
	}
}
