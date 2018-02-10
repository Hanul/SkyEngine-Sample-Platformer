Platformer.Player = CLASS({
	
	preset : () => {
		return SkyEngine.StateSet;
	},
	
	params : () => {
		
		return {
			accelY : Platformer.Global.gravity,
			stateNodes : {
				idle : SkyEngine.Sprite({
					y : -92,
					srcs : [
						Platformer.R('image/alienGreen_stand.png')
					]
				}),
				walk : SkyEngine.Sprite({
					y : -92,
					srcs : [
						Platformer.R('image/alienGreen_walk1.png'),
						Platformer.R('image/alienGreen_walk2.png')
					],
					fps : 10,
					isHiding : true
				}),
				jump : SkyEngine.Sprite({
					y : -92,
					srcs : [
						Platformer.R('image/alienGreen_jump.png')
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
			mp3 : Platformer.R('sound/jump.mp3'),
			ogg : Platformer.R('sound/jump.ogg')
		});
		
		SkyEngine.Screen.cameraFollowX({
			target : self
		});
		
		self.addCollider(SkyEngine.Rect({
			y : -92,
			width : 80,
			height : 184
		}));
		
		let shw = self.getCollider().getWidth() / 2;
		let sh = self.getCollider().getHeight();
		
		// 충돌 타일과 부딪힌 경우
		self.onMeet(SkyEngine.CollisionTile, (tile) => {
			
			let hw = tile.getCollider().getWidth() / 2;
			let hh = tile.getCollider().getHeight() / 2;
			
			// 아래로 부딪힘
			if (
			self.getBeforeY() <= tile.getY() - hh &&
			
			self.getX() - shw < tile.getX() + hw &&
			tile.getX() - hw < self.getX() + shw) {
				
				self.setY(tile.getY() - hh);
				self.stopDown();
				
				if (self.getState() === 'jump') {
					// 이동중이고, 가속도가 없어야 합니다. (가속도가 있다는 것은 멈추는 중인 상황)
					if (self.getSpeedX() !== 0 && self.getAccelX() === 0) {
						self.setState('walk');
					} else {
						self.setState('idle');
					}
				}
			}
			
			// 위로 부딪힘
			else if (
			self.getBeforeY() - sh >= tile.getY() + hh &&
			
			self.getX() - shw < tile.getX() + hw &&
			tile.getX() - hw < self.getX() + shw) {
				
				self.setY(tile.getY() + hh + sh);
				self.stopUp();
			}
			
			// 좌우로 부딪힘
			else {
				
				// 왼쪽으로 부딪힘
				if (
				self.getBeforeX() - shw >= tile.getX() + hw &&
				
				self.getY() - sh < tile.getY() + hh &&
				tile.getY() - hh < self.getY()) {
					
					self.setX(tile.getX() + hw + shw);
					self.stuckLeft();
				}
				
				// 오른쪽으로 부딪힘
				if (
				self.getBeforeX() + shw <= tile.getX() - hw &&
				
				self.getY() - sh < tile.getY() + hh &&
				tile.getY() - hh < self.getY()) {
					
					self.setX(tile.getX() - hw - shw);
					self.stuckRight();
				}
			}
		});
		
		// 충돌 타일과 떨어진 경우
		self.onPart(SkyEngine.CollisionTile, (tile) => {
			
			let hw = tile.getCollider().getWidth() / 2;
			let hh = tile.getCollider().getHeight() / 2;
			
			// 왼쪽 타일로부터 떨어진 경우
			if (tile.getX() + hw <= self.getX() - shw) {
				self.unstuckLeft();
				
				// 떨어지는 경우
				if (tile.getY() - hh <= self.getY()) {
					self.setAccelY(3000);
				}
			}
			
			// 오른쪽 타일로부터 떨어진 경우
			else if (self.getX() + shw <= tile.getX() - hw) {
				self.unstuckRight();
				
				// 떨어지는 경우
				if (tile.getY() - hh <= self.getY()) {
					self.setAccelY(3000);
				}
			}
			
			// 왼쪽도 오른쪽도 아니면, 점프한 경우
			else {
				self.setAccelY(3000);
			}
		});
		
		// 화면 밖으로 나가면 사망
		self.on('offscreen', () => {
			if (self.getY() > 1000) {
				
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
