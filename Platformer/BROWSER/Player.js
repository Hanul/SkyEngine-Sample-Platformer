Platformer.Player = CLASS({
	
	preset : () => {
		return SkyEngine.StateSet;
	},
	
	params : () => {
		
		return {
			centerY : 92,
			accelY : Platformer.Global.gravity,
			collider : SkyEngine.Rect({
				width : 80,
				height : 184
			}),
			stateNodes : {
				idle : SkyEngine.Sprite({
					srcs : [
						Platformer.R('players/Green/alienGreen_stand.png')
					]
				}),
				walk : SkyEngine.Sprite({
					srcs : [
						Platformer.R('players/Green/alienGreen_walk1.png'),
						Platformer.R('players/Green/alienGreen_walk2.png')
					],
					fps : 10,
					isHiding : true
				}),
				jump : SkyEngine.Sprite({
					srcs : [
						Platformer.R('players/Green/alienGreen_jump.png')
					],
					isHiding : true
				})
			},
			baseState : 'idle'
		};
	},
	
	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.lands
		
		let lands = params.lands;
		
		let jumpSound = SOUND({
			mp3 : Platformer.R('Sound/jump.mp3'),
			ogg : Platformer.R('Sound/jump.ogg')
		});
		
		SkyEngine.Screen.cameraFollowX({
			target : self
		});
		
		// 타일과 만났다.
		self.onMeet(SkyEngine.CollisionTile, (tile) => {
			
			if (self.getBeforeY() <= lands.getY() + tile.getY() - lands.getTileHeight() / 2) {
				self.setY(lands.getY() + tile.getY() - lands.getTileHeight() / 2);
				self.setAccelY(0);
				self.stopDown();
				
				if (self.getState() === 'jump') {
					// 이동중이고, 가속도가 없어야 합니다. (가속도가 있다는 것은 멈추는 중인 상황임)
					if (self.getSpeedX() !== 0 && self.getAccelX() === 0) {
						self.setState('walk');
					} else {
						self.setState('idle');
					}
				}
			}
			
			else {
				if (self.getSpeedX() < 0) {
					self.setX(lands.getX() + tile.getX() + lands.getTileWidth() / 2 + self.getColliders()[0].getWidth() / 2);
					self.stuckLeft();
				}
				if (self.getSpeedX() > 0) {
					self.setX(lands.getX() + tile.getX() - lands.getTileWidth() / 2 - self.getColliders()[0].getWidth() / 2);
					self.stuckRight();
				}
			}
		});
		
		// 땅과 떨어졌다.
		self.onPart(lands, () => {
			self.setAccelY(Platformer.Global.gravity);
			
			if (self.getState() === 'walk') {
				if (self.getScaleX() === -1) {
					self.unstuckLeft();
				} else {
					self.unstuckRight();
				}
			}
		});
		
		// 키를 눌렀다.
		let keydownEvent = EVENT('keydown', (e) => {
			
			if (e.getKey() === 'ArrowLeft') {
				self.moveLeft(500);
				self.setScaleX(-1);
				
				if (self.getState() !== 'jump') {
					self.setState('walk');
				}
			}
			
			if (e.getKey() === 'ArrowRight') {
				self.moveRight(500);
				self.setScaleX(1);
				
				if (self.getState() !== 'jump') {
					self.setState('walk');
				}
			}
			
			if (e.getKey() === ' ' && self.getState() !== 'jump' && self.getSpeedY() === 0) {
				self.setSpeedY(-1200);
				self.setAccelY(Platformer.Global.gravity);
				
				self.setState('jump');
				
				jumpSound.play();
			}
		});
		
		// 키를 뗐다.
		let keyupEvent = EVENT('keyup', (e) => {
			
			if (self.getScaleX() === -1 && e.getKey() === 'ArrowLeft') {
				if (self.getSpeedX() < 0) {
					self.stopLeft(2500);
				}
				if (self.getState() !== 'jump') {
					self.setState('idle');
				}
			}
			
			if (self.getScaleX() === 1 && e.getKey() === 'ArrowRight') {
				if (self.getSpeedX() > 0) {
					self.stopRight(2500);
				}
				if (self.getState() !== 'jump') {
					self.setState('idle');
				}
			}
		});
		
		self.on('remove', () => {
			
			jumpSound.stop();
			jumpSound = undefined;
			
			keydownEvent.remove();
			keyupEvent.remove();
		});
	}
});
