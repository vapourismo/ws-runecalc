/* Copyright (C) 2016, Ole Krüger <ole@vprsm.de> */

"use strict";

import React, {Component} from "react";
import Runes from "../database/runes.jsx";

export default class Rune extends Component {
	render() {
		const rune = Runes[this.props.runeID];

		if (!rune)
			return null;

		return (
			<div className="rune">
				<div className={`symbol power-${rune.power}`}>
					<div className={`icon ${rune.type}`}>
						{rune.power}
					</div>
				</div>
				<div className="description">
					<div className="name">
						{rune.statName}
					</div>
					<div className="set-name">
						+{rune.power} {rune.setName}
					</div>
				</div>
				<div className="rating">
					{rune.statValue}
				</div>
			</div>
		);
	}
}
