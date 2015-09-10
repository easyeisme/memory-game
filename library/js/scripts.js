jQuery(document).ready(function($) {



	// ===== ARRAY SHUFFLE PROTOTYPE
	// ================================================================================

	Array.prototype.shuffle = function() {
		var input = this;
		var index;
		var current;
		for(var i = input.length-1; i >= 0; i--) {
			index = Math.floor(Math.random() * (i+1));
			current = input[index];
			input[index] = input[i];
			input[i] = current;
		}
		return input;
	};



	// ===== GLOBAL HELPER OBJECT
	// ================================================================================

	var globalHelper = {
		// Returns a function that, as long as it continues to be invoked, will not
		// be triggered. The function will be called after it stops being called for
		// N milliseconds. If 'immediate' is passed, trigger the function on the
		// leading edge, instead of the trailing.
		//
		// Use:  $(window).resize(globalHelper.debounce(function() { ...[your code here]... }, 500));
		// Source:  http://davidwalsh.name/javascript-debounce-function
		debounce: function(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if(!immediate) { func.apply(context, args); }
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if(callNow) { func.apply(context, args); }
			};
		}
	};



	// ===== GAME SETTINGS & GAME PLAY
	// ================================================================================

	var game = {
		card_deck: [],
		card_selection: [], // user's card selection(s)
		card_flip_duration: 0, // duration of card flip animation, in seconds
		is_processing: false, // is the app currently comparing the player's selection?
		// Game Settings
		config: {
			difficulty: 'lvl2', // default setting
			style: 'poker', // default setting
			cards_per_game: 0,
			card_face: []
		},
		// Options for Game Settings
		settings: {
			difficulty: {
				lvl1: 12,
				lvl2: 20,
				lvl3: 36
			},
			style: {
				poker: [
					'J', // Joker
					'CA','C2','C3','C4','C5','C6','C7','C8','C9','C10','CJ','CQ','CK', // Clubs
					'DA','D2','D3','D4','D5','D6','D7','D8','D9','D10','DJ','DQ','DK', // Diamonds
					'HA','H2','H3','H4','H5','H6','H7','H8','H9','H10','HJ','HQ','HK', // Hearts
					'SA','S2','S3','S4','S5','S6','S7','S8','S9','S10','SJ','SQ','SK', // Spades
				],
				arcade: ['birdo', 'blooper', 'bob-omb', 'boo', 'bowser', 'buzzy-beetle', 'cheep-cheep', 'coin', 'diddy-kong', 'donkey-kong', 'fire-flower', 'goomba', 'hammer-bro', 'koopa-paratroopa', 'koopa-troopa', 'lakitu', 'luigi', 'mario', 'mushroom', 'peach', 'red-shell', 'toad', 'wario', 'yoshi'],
				comic: ['captain-america', 'colossus', 'cyclops', 'deadpool', 'gambit', 'hulk', 'human-torch', 'iron-man', 'juggernaut', 'magneto', 'mr-fantastic', 'nick-fury', 'nightcrawler', 'spiderman', 'storm', 'thor', 'venom', 'wolverine']
			}
		},
		// In-Game Statistics
		stats: {
			game_time: [],
			match_attempts: 0,
			matches_found: 0
		}
	};

	var app = {
		settings: {
			body: $('body'),
			dashboard: $('.dashboard'),
			dashboard_wrapper: $('.dashboard-wrapper'),
			dashboard_main: $('.dashboard-main-controls'),
			dashboard_options: $('.dashboard-options'),
			dashboard_stats: $('.dashboard-stats'),
			btn_play: $('.btn-start'),
			btn_options: $('.btn-options'),
			btn_options_ctrl: $('.btn-options-ctrl'),
			btn_options_close: $('.btn-options-close'),
			btn_stats_close: $('.btn-stats-close'),
			stat: {
				time: $('.dashboard-stat-time'),
				attempts: $('.dashboard-stat-attempts'),
				accuracy: $('.dashboard-stat-accuracy')
			},
			card_grid: $('.card-grid')
		},
		init: function() {
			this.bindEvents();
			this.dashboardInit();
			this.repositionDashboard();
		},
		bindEvents: function() {
			$(window).resize(globalHelper.debounce(function() {
				app.repositionDashboard();
			}, 500));
			this.settings.btn_play.on('click', function() {
				app.startGame();
				app.updateDashboardDisplay('start');
			});
			this.settings.btn_options.on('click', function() {
				app.updateDashboardDisplay('options');
			});
			this.settings.btn_options_close.on('click', function() {
				app.updateDashboardDisplay('options-to-dashboard');
			});
			this.settings.btn_stats_close.on('click', function() {
				app.updateDashboardDisplay('stats-to-dashboard');
			});
			this.settings.btn_options_ctrl.on('click', function() {
				app.updateDashboardOption($(this));
			});
			$('body').on('click', '.card', function() {
				app.revealCard($(this));
			});
		},

		// Setup the default game configuration options on the Dashboard Options display
		dashboardInit: function() {
			this.settings.dashboard_options.find('[data-opt="difficulty"][data-value="'+game.config.difficulty+'"]').addClass('selected');
			this.settings.dashboard_options.find('[data-opt="style"][data-value="'+game.config.style+'"]').addClass('selected');
		},

		// Reposition the Dashboard Wrapper
		repositionDashboard: function() {
			var dash_margin = this.settings.dashboard_wrapper.innerHeight() / 2;
			this.settings.dashboard_wrapper.css('margin-top', -(dash_margin));
		},

		// Toggle the Dashboard display
		updateDashboardDisplay: function(display) {
			// Start the Game
			if(display == 'start') {
				this.settings.dashboard.fadeOut(300);
			}
			// Display the Dashboard Options
			if(display == 'options') {
				this.settings.body.addClass('dashboard-options-on');
				this.settings.dashboard_main.fadeOut(300, function() {
					this.settings.dashboard_options.fadeIn(300, function() {
						this.repositionDashboard();
					}.bind(this));
				}.bind(this));
			}
			// Display the Main Dashboard (from the Dashboard Options page)
			if(display == 'options-to-dashboard') {
				this.settings.body.removeClass('dashboard-options-on');
				this.settings.dashboard_options.fadeOut(300, function() {
					this.settings.dashboard_main.fadeIn(300, function() {
						this.repositionDashboard();
					}.bind(this));
				}.bind(this));
			}
			// Display the Main Dashboard (from the Dashboard Stats page)
			if(display == 'stats-to-dashboard') {
				this.settings.dashboard_stats.fadeOut(300, function() {
					this.settings.dashboard_main.fadeIn(300, function() {
						this.repositionDashboard();
					}.bind(this));
				}.bind(this));
			}
			// Display the Dashboard "Game Over" Display
			if(display == 'game-over') {
				this.calculateGameStats();
				this.settings.dashboard_main.hide();
				this.settings.dashboard_stats.show();
				this.settings.dashboard.fadeIn(300, function() {
					this.repositionDashboard();
				}.bind(this));
			}
		},

		// Toggle Game Configuration Options
		// Handles all game configuration options.  Also handles both directions (prev/next).
		updateDashboardOption: function(trigger) {
			var opt_current, opt_new;
			// Find current option and deselected it.
			opt_current = trigger.parent().find('.selected');
			opt_current.removeClass('selected');
			// Depending on the desired direction, find the next option in the sequence of options.
			if(trigger.data('dir') == 'next') {
				opt_new = opt_current.next();
				// Find next option.  If next doesn't exist, select first option.
				if(opt_new.length) {
					opt_new.addClass('selected');
				} else {
					opt_new = trigger.parent().find('.game-config-opt:first').addClass('selected');
				}
			}
			// Depending on the desired direction, find the previous option in the sequence of options.
			if(trigger.data('dir') == 'prev') {
				opt_new = opt_current.prev();
				// Find previous option.  If previous doesn't exist, select last option.
				if(opt_new.length) {
					opt_new.addClass('selected');
				} else {
					opt_new = trigger.parent().find('.game-config-opt:last').addClass('selected');
				}
			}
			// Update the game configuration options based on the recent change.
			game.config[opt_new.data('opt')] = opt_new.data('value');
		},

		// Start a New Game
		startGame: function() {
			this.resetGame();
			this.configureGame();
			this.logTime();
			this.setupGameBoard();
		},

		// Configure Game Settings
		configureGame: function() {
			game.config.cards_per_game = game.settings.difficulty[game.config.difficulty];
			game.config.card_face = game.settings.style[game.config.style];
			this.settings.body.attr('data-difficulty', game.config.difficulty);
			this.settings.body.attr('data-card-style', game.config.style);
		},

		// Resets Game Statistics
		resetGame: function() {
			game.stats.game_time = [];
			game.stats.match_attempts = 0;
			game.stats.matches_found = 0;
		},

		// End the Game
		endGame: function() {
			this.logTime();
			this.updateDashboardDisplay('game-over');
		},

		// Records the current time
		logTime: function() {
			game.stats.game_time.push(Date.now());
		},

		// Generates and shuffles a new deck of cards, and displays them on the game board
		setupGameBoard: function() {
			var i;

			// Generate a new deck of cards.  Each card will be assigned an integer value.
			// Once complete, shuffle the deck.
			game.card_deck = [];
			for(i = 1; i <= game.config.cards_per_game; i++) {
				game.card_deck.push(Math.ceil(i/2)); // generates pairs (i.e. the same number every two iterations)
			}
			game.card_deck.shuffle();

			// Shuffle the card faces.
			// Random card faces can then be assigned to a given card value.
			game.config.card_face.shuffle();

			// Display the cards on the game board
			var cv; // card value
			this.settings.card_grid.html('');
			for(i = 0; i < game.config.cards_per_game; i++) {
				cv = game.card_deck[i];
				this.settings.card_grid.append(
					'<div class="card-wrapper">'+
						'<div class="card-padding">'+
							'<div class="card card-face-'+game.config.card_face[cv-1]+'" data-value="'+cv+'" data-face="'+game.config.card_face[cv-1]+'">'+
								'<div class="card-back"><div class="pattern"></div></div>'+
								'<div class="card-front"></div>'+
							'</div>'+
						'</div>'+
					'</div>'
				);
			}

			// Extract the animation duration of the "card flip" from first card
			game.card_flip_duration = 1000 * parseFloat($('.card:eq(0)').css('transition-duration'));
		},

		// Reveals a playing card
		revealCard: function(e) {
			if(!game.is_processing) {
				if(!(e.hasClass('revealed'))) {
					e.addClass('revealed');
					game.card_selection.push(e);
					if(game.card_selection.length == 2) {
						game.stats.match_attempts++;
						this.compareSelection();
					}
				}
			}
		},

		// Compares the two selected playing cards to determine if there's a match
		compareSelection: function() {
			game.is_processing = true;
			var c1 = game.card_selection[0];
			var c2 = game.card_selection[1];
			if(c1.data('value') == c2.data('value')) {
				c1.addClass('matched');
				c2.addClass('matched');
				game.stats.matches_found++;
				game.is_processing = false;
			} else {
				setTimeout(function() {
					c1.removeClass('revealed');
					c2.removeClass('revealed');
					game.is_processing = false;
				}.bind(this), (game.card_flip_duration + 600));
			}
			game.card_selection = [];

			// End the game once all matches are found
			if(game.stats.matches_found == (game.config.cards_per_game / 2)) {
				setTimeout(function() {
					this.endGame();
				}.bind(this), game.card_flip_duration);
			}
		},

		// Calculate the final in-game statistics, and display them accordingly.
		calculateGameStats: function() {
			var time = {
				duration: parseInt((game.stats.game_time[1] - game.stats.game_time[0]) / 1000),
				minutes: 0,
				seconds: 0,
				output: ''
			};
			time.minutes = Math.floor(time.duration / 60);
			time.seconds = time.duration - (time.minutes * 60);
			time.seconds = (time.seconds < 10) ? '0'+time.seconds : time.seconds;
			time.output = time.minutes + ':' + time.seconds;
			var attempts = game.stats.match_attempts;
			var accuracy = (game.stats.matches_found / attempts) * 100;
			accuracy = accuracy.toFixed(2);
			this.settings.stat.time.html(time.output);
			this.settings.stat.attempts.html(attempts);
			this.settings.stat.accuracy.html(accuracy+'%');
		}
	};
	app.init();


});