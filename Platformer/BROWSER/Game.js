Platformer.Game = CLASS({
	
	preset : () => {
		return VIEW;
	},
	
	init : (inner) => {
		
		let bgm = SOUND({
			mp3 : Platformer.R('sound/bgm.mp3'),
			ogg : Platformer.R('sound/bgm.ogg')
		});
		
		bgm.play();
		
		let rootNode = SkyEngine.Node({
			scale : 0.5,
			c : SkyEngine.Background({
				src : Platformer.R('image/blue_land.png'),
				isNotToRepeatY : true
			})
		}).appendTo(SkyEngine.Screen);
		
		// 땅
		let lands = SkyEngine.TileMap({
			tileWidth : 128,
			tileHeight : 128,
			tileSet : {
				1 : () => {
					return SkyEngine.CollisionTile({
						c : SkyEngine.Image({
							src : Platformer.R('image/grass.png')
						})
					});
				},
				2 : () => {
					return SkyEngine.Tile({
						c : SkyEngine.Image({
							src : Platformer.R('image/signRight.png')
						})
					});
				}
			},
			tileKeyMap : [
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[2, 0, 0, 0, 0, 0, 0, 0, 0],
				[1, 1, 0, 1, 1, 1, 1, 1, 1]
			]
		}).appendTo(rootNode);
		
		Platformer.Player({
			lands : lands
		}).appendTo(rootNode);
		
		inner.on('close', () => {
			bgm.stop();
			bgm = undefined;
			
			rootNode.remove();
		});
	}
});
