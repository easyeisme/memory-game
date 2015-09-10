<!DOCTYPE html>
<html>
<head>
<title>Memory Game</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />

<link rel="stylesheet" type="text/css" href="library/css/main.css" />
<script src="library/js/jquery-2.1.4.min.js"></script>
<script src="library/js/scripts.js"></script>
</head>
<body data-difficulty="" data-card-style="">


<div class="dashboard">
	<div class="dashboard-wrapper">
		<div class="dashboard-logo"></div>
		<div class="dashboard-main-controls">
			<div class="btn btn-start">Play</div>
			<div class="btn btn-options">Options</div>
		</div>
		<div class="dashboard-options">
			<div class="game-config game-config-difficulty">
				<div class="label">Difficulty</div>
				<div class="game-config-opt-wrapper">
					<ul>
						<li class="btn-faux game-config-opt" data-opt="difficulty" data-value="lvl1">Easy</li>
						<li class="btn-faux game-config-opt" data-opt="difficulty" data-value="lvl2">Moderate</li>
						<li class="btn-faux game-config-opt" data-opt="difficulty" data-value="lvl3">Hard</li>
					</ul>
					<div class="btn btn-options-ctrl game-config-ctrl game-config-ctrl-prev" data-dir="prev">Prev</div>
					<div class="btn btn-options-ctrl game-config-ctrl game-config-ctrl-next" data-dir="next">Next</div>
				</div>
			</div>
			<div class="game-config game-config-style">
				<div class="label">Card Style</div>
				<div class="game-config-opt-wrapper">
					<ul>
						<li class="btn-faux game-config-opt" data-opt="style" data-value="poker">Poker</li>
						<li class="btn-faux game-config-opt" data-opt="style" data-value="arcade">Arcade</li>
						<li class="btn-faux game-config-opt" data-opt="style" data-value="comic">Comic</li>
					</ul>
					<div class="btn btn-options-ctrl game-config-ctrl game-config-ctrl-prev" data-dir="prev">Prev</div>
					<div class="btn btn-options-ctrl game-config-ctrl game-config-ctrl-next" data-dir="next">Next</div>
				</div>
			</div>
			<div class="btn btn-options-close">Back</div>
		</div>
		<div class="dashboard-stats">
			<div class="title">You Won!</div>
			<table align="center" border="0" cellpadding="0" cellspacing="0">
				<tr><td class="dashboard-stat-label">Time:</td><td class="dashboard-stat dashboard-stat-time">0:00</td></tr>
				<tr><td class="dashboard-stat-label">Attempts:</td><td class="dashboard-stat dashboard-stat-attempts">0</td></tr>
				<tr><td class="dashboard-stat-label">Accuracy:</td><td class="dashboard-stat dashboard-stat-accuracy">0%</td></tr>
			</table>
			<div class="btn btn-stats-close">New Game</div>
		</div>
	</div>
</div>
<div class="card-grid"></div>


</body>
</html>