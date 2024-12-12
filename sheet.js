// sheet.js
class CharacterSheet {
	constructor(data) {
		this.data = data;
	}

	getAbilityModifier(score) {
		return Math.floor((score - 10) / 2);
	}

	formatModifier(value) {
		return value >= 0 ? `+${value}` : value.toString();
	}

	renderHeader() {
		return `
            <h1>${this.data.name}</h1>
            <div class="section">
                <h2>Character Details</h2>
                <div class="stats-grid">
                    ${this.renderStatBox("Race", this.data.race)}
                    ${this.renderStatBox("Class", `${this.data.class} (Level ${this.data.level})`)}
                    ${this.renderStatBox("Background", this.data.background)}
                    ${this.renderStatBox("Alignment", this.data.alignment)}
                </div>
            </div>
        `;
	}

	renderAbilityScores() {
		const abilities = Object.entries(this.data.stats)
			.map(([ability, score]) => {
				const modifier = this.getAbilityModifier(score);
				return this.renderStatBox(ability.toUpperCase(), `${score} (${this.formatModifier(modifier)})`);
			})
			.join("");

		return `
            <div class="section">
                <h2>Ability Scores</h2>
                <div class="stats-grid">
                    ${abilities}
                </div>
            </div>
        `;
	}

	renderCombatStats() {
		return `
            <div class="section">
                <h2>Combat Stats</h2>
                <div class="stats-grid">
                    ${this.renderStatBox("Armor Class", this.data.armor_class)}
                    ${this.renderStatBox("Hit Points", this.data.hit_points)}
                    ${this.renderStatBox("Speed", `${this.data.speed} ft`)}
                    ${this.renderStatBox("Proficiency", this.formatModifier(this.data.proficiency_bonus))}
                </div>
            </div>
        `;
	}

	renderSkills() {
		// Skill to ability score mapping
		const skillAbilities = {
			acrobatics: "dexterity",
			animal_handling: "wisdom",
			arcana: "intelligence",
			athletics: "strength",
			deception: "charisma",
			history: "intelligence",
			insight: "wisdom",
			intimidation: "charisma",
			investigation: "intelligence",
			medicine: "wisdom",
			nature: "intelligence",
			perception: "wisdom",
			performance: "charisma",
			persuasion: "charisma",
			religion: "intelligence",
			sleight_of_hand: "dexterity",
			stealth: "dexterity",
			survival: "wisdom",
		};

		// Group skills by ability
		const skillsByAbility = {};
		Object.entries(this.data.skills).forEach(([skillName, bonus]) => {
			const ability = skillAbilities[skillName];
			if (!skillsByAbility[ability]) {
				skillsByAbility[ability] = [];
			}

			// Format skill name for display
			const displayName = skillName
				.split("_")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");

			skillsByAbility[ability].push({
				name: displayName,
				bonus: this.formatModifier(bonus),
			});
		});

		// Create HTML for each ability group
		const skillGroups = Object.entries(skillsByAbility)
			.map(
				([ability, skills]) => `
                <div class="skill-group">
                    <h3>${ability.toUpperCase()}</h3>
                    <div class="skill-list">
                        ${skills
													.map(
														(skill) => `
                            <div class="skill-item">
                                <span class="skill-name">${skill.name}</span>
                                <span class="skill-bonus">${skill.bonus}</span>
                            </div>
                        `,
													)
													.join("")}
                    </div>
                </div>
            `,
			)
			.join("");

		return `
            <div class="section">
                <h2>Skills</h2>
                <div class="skills-grid">
                    ${skillGroups}
                </div>
            </div>
        `;
	}

	renderWeapons() {
		const weapons = this.data.equipment.weapons
			.map(
				(weapon) => `
            <div class="weapon">
                <h3>${weapon.name}</h3>
                <p>${weapon.type} - ${weapon.damage}</p>
                <p><em>${weapon.description || ""}</em></p>
            </div>
        `,
			)
			.join("");

		return `
            <div class="section">
                <h2>Equipment</h2>
                <div class="equipment-list">
                    ${weapons}
                </div>
            </div>
        `;
	}

	renderGear() {
		// gear is an array of strings like this:
		// "gear": ["Explorer's Pack", "Dwarven Amulet", "Potion of Healing (x2)"]
		const gear = this.data.equipment.gear.map((item) => `<li>${item}</li>`).join("");

		return `

            <div class="section">
                <h2>Gear</h2>
                <ul class="gear">
                    ${gear}
                </ul>
            </div>
        `;
	}

	renderFeatures() {
		const features = this.data.features_and_traits.map((feature) => `<li>${feature}</li>`).join("");

		return `
            <div class="section">
                <h2>Features & Traits</h2>
                <ul class="features">
                    ${features}
                </ul>
            </div>
        `;
	}

	renderFeats() {
		const feats = this.data.feats.map((feat) => `<li>${feat}</li>`).join("");

		return `
            <div class="section">
                <h2>Feats</h2>
                <ul class="feats">
                    ${feats}
                </ul>
            </div>
        `;
	}

	renderPersonality() {
		return `
            <div class="section">
                <h2>Personality</h2>
                <p class="personality">
                    ${this.data.personality_traits.join(", ")}.
                    ${this.data.background_details.origin}
                </p>
            </div>
        `;
	}

	renderStatBox(label, value) {
		return `
            <div class="stat-box">
                <h3>${label}</h3>
                <p>${value}</p>
            </div>
        `;
	}

	render() {
		return `
            <div class="character-sheet">
                ${this.renderHeader()}
                ${this.renderAbilityScores()}
                ${this.renderCombatStats()}
                ${this.renderSkills()}
                ${this.renderWeapons()}
                ${this.renderGear()}
                ${this.renderFeatures()}
                ${this.renderFeats()}
                ${this.renderPersonality()}
            </div>
        `;
	}
}

// Load and render the character sheet
async function loadCharacterSheet() {
	try {
		const response = await fetch("char.json");
		const data = await response.json();
		const sheet = new CharacterSheet(data);
		document.getElementById("app").innerHTML = sheet.render();
	} catch (error) {
		console.error("Error loading character sheet:", error);
	}
}

// Export for use in other modules
export { CharacterSheet, loadCharacterSheet };
