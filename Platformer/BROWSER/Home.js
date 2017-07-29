Platformer.Home = CLASS({
	
	preset : () => {
		return VIEW;
	},
	
	init : (inner) => {
		
		let bgm = SOUND({
			mp3 : Platformer.R('Sound/bgm.mp3'),
			ogg : Platformer.R('Sound/bgm.ogg')
		});
		
		bgm.play();
		
		let rootNode = SkyEngine.Node({
			scale : 0.5,
			dom : DIV({
				style : {
					position : 'absolute',
					top : -200,
					left : -100,
					fontSize : 50,
					width : 200,
					textAlign : 'center',
					color : '#000'
				},
				c : '플랫포머'
			}),
			c : [SkyEngine.Background({
				src : Platformer.R('Backgrounds/blue_land.png'),
				isNotToRepeatY : true
			}), SkyEngine.Node({
				y : 50,
				scale : 2,
				dom : DIV({
					style : {
						width : 320,
						fontSize : 20
					},
					c : [UUI.V_CENTER({
						style : {
							flt : 'left',
							backgroundImage : Platformer.R('UI/green_panel.png'),
							width : 100,
							height : 100,
							textAlign : 'center',
							cursor : 'pointer'
						},
						c : 'Grass',
						on : {
							tap : () => {
								Platformer.GO('level/grass');
							}
						}
					}), UUI.V_CENTER({
						style : {
							flt : 'left',
							marginLeft : 10,
							backgroundImage : Platformer.R('UI/red_panel.png'),
							width : 100,
							height : 100,
							textAlign : 'center',
							cursor : 'pointer'
						},
						c : 'Sand',
						on : {
							tap : () => {
								Platformer.GO('level/sand');
							}
						}
					}), UUI.V_CENTER({
						style : {
							flt : 'left',
							marginLeft : 10,
							backgroundImage : Platformer.R('UI/grey_panel.png'),
							width : 100,
							height : 100,
							textAlign : 'center',
							cursor : 'pointer',
							color : '#000'
						},
						c : 'Snow',
						on : {
							tap : () => {
								Platformer.GO('level/snow');
							}
						}
					}), CLEAR_BOTH()]
				})
			})]
		}).appendTo(SkyEngine.Screen);
		
		inner.on('close', () => {
			bgm.stop();
			bgm = undefined;
			
			rootNode.remove();
		});
	}
});
