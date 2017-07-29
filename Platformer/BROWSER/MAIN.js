Platformer.MAIN = METHOD({

	run : (params) => {
		
		Platformer.MATCH_VIEW({
			uri : '',
			target : Platformer.Home
		});
		
		Platformer.MATCH_VIEW({
			uri : 'level/grass',
			target : Platformer.Grass
		});
	}
});
