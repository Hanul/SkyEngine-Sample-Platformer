Platformer.Grass = CLASS({
	
	preset : () => {
		return VIEW;
	},
	
	init : (inner) => {
		
		let rootNode = SkyEngine.Node({
			scale : 0.5,
			c : SkyEngine.Background({
				src : Platformer.R('Backgrounds/blue_land.png'),
				isNotToRepeatY : true
			})
		}).appendTo(SkyEngine.Screen);
		
		// 땅
		let lands = SkyEngine.TileMap({
			x : -100,
			y : 300,
			tileWidth : 128,
			tileHeight : 128,
			tileKeySet : {
				1 : SkyEngine.Image({
					src : Platformer.R('Ground/Grass/grass.png')
				}),
				2 : SkyEngine.Image({
					src : Platformer.R('Tiles/bush.png')
				})
			},
			tileKeyMap : [
				[2, 0, 0, 0, 0, 0, 0, 0, 0],
				[1, 1, 0, 1, 1, 1, 1, 1, 1]
			],
			collisionMap : [
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[1, 1, 0, 1, 1, 1, 1, 1, 1]
			]
		}).appendTo(rootNode);
		
		Platformer.Player({
			lands : lands
		}).appendTo(rootNode);
		
		inner.on('close', () => {
			rootNode.remove();
		});
	}
});
