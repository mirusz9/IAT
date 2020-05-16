// Only start when window is loaded
window.addEventListener("load", async () => {
	// Loads an image, returns a promise
	const loadImage = (src) => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.addEventListener("load", () => resolve(img));
			img.addEventListener("error", (err) => reject(err));
			img.src = src;
		});
	};

	// Loads all the images of the given type
	const loadImageType = async (type) => {
		let images = new Array(6);
		for (var i = 0; i < 6; i++) {
			images[i] = loadImage(`./images/${type}/${i + 1}.png`);
		}
		return await Promise.all(images);
	};

	// This shuffles the array given times
	const shuffle = (array, times) => {
		for (let i = 0; i < times; i++) {
			for (let j = 0; j < array.length; j++) {
				let k = Math.floor(Math.random() * (j + 1));
				[array[j], array[k]] = [array[k], array[j]];
			}
		}
		return array;
	};

	const generateImages = async (...args) => {
		// Get all the images of all the types
		let imageArray = new Array(args.length);
		for (let i = 0; i < args.length; i++) {
			imageArray[i] = await loadImageType(args[i]);
		}

		// Make every element into an object that has the type of
		// the image so later it can be identified
		let imageObjects = new Array(args.length * 6);
		for (let i = 0; i < imageArray.length; i++) {
			for (let j = 0; j < 6; j++) {
				let object = {};
				object.type = args[i];
				object.src = imageArray[i][j];
				imageObjects[i * 6 + j] = object;
			}
		}
		return shuffle(imageObjects, 3); // Return the shuffled array
	};

	// Clears the canvas and draws the image
	const displayImage = (() => {
		// Setting up canvas
		const canvas = document.getElementById("imagePlaceholder");
		const ctx = canvas.getContext("2d");
		canvas.height = 400;
		canvas.width = 400;

		return (imageSrc) => {
			ctx.fillStyle = "#fff";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(
				imageSrc,
				0,
				0,
				imageSrc.width,
				imageSrc.height,
				0,
				0,
				canvas.width,
				canvas.height
			);
		};
	})();

	const rounds = [
		{
			left: "Cigány",
			right: "Fehér",
			images: await generateImages("roma", "feher"),
		},
		{
			left: "Bogár",
			right: "Cuki",
			images: await generateImages("bogar", "cuki"),
		},
		{
			left: "Cigány<br>Cuki",
			right: "Fehér<br>Bogár",
			images: await generateImages("roma", "cuki", "feher", "bogar"),
		},
		{
			left: "Fehér",
			right: "Fekete",
			images: await generateImages("feher", "roma"),
		},
		{
			left: "Cuki<br>Fehér",
			right: "Cigány<br>Bogár",
			images: await generateImages("roma", "cuki", "feher", "bogar"),
		},
	];

	// Updates the text on the left and right side of the window
	const updateRound = (() => {
		const left = document.getElementById("left");
		const right = document.getElementById("right");
		const infoBox = document.getElementById("roundInfo");
		const roundDisplay = document.getElementById("round");
		const canvas = document.getElementById("imagePlaceholder");

		return (round) => {
			if (round) {
				left.innerHTML = round.left;
				right.innerHTML = round.right;
				canvas.style.display = "none";
				roundDisplay.innerHTML = `${rounds.indexOf(round) + 1}. Kör`;
				infoBox.style.display = "block";
			} else {
				infoBox.style.display = "none";
				canvas.style.display = "block";
			}
		};
	})();

	// Displays next image or next round
	const keyPressed = (() => {
		let roundIndex = 0;
		let imageIndex = 0;
		let currendRound = rounds[roundIndex];
		updateRound(currendRound);

		return (keyCode) => {

			if (imageIndex === 0) {
				// If the first image, then hide the text and display image
				updateRound();
				imageIndex++;
				displayImage(currendRound.images[imageIndex - 1].src);
			} else {
				// If not the first image
				if (keyCode) {
					// Save results
					imageIndex++; // Prepare to show next image
					// Check if there is next image of round is over
					if (imageIndex === currendRound.images.length + 1) {
						// If round is over, show the text and hide canvas
						roundIndex++;
						imageIndex = 0;
						currendRound = rounds[roundIndex];
						updateRound(currendRound);
					} else {
						// If round is note over, display the image
						displayImage(currendRound.images[imageIndex - 1].src);
					}
				}
			}
		};
	})();

	window.addEventListener("keydown", (event) => {
		// Safety stuff
		if (event.isComposing || event.keyCode === 229) {
			return;
		}
		// Only register if key is left or right arrow
		if (event.keyCode === 37 || event.keyCode === 39) {
			keyPressed(event.keyCode);
			return;
		}
		keyPressed();
	});
});
