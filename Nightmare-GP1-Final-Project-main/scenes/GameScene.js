export class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.mailCollected = 0;
        this.hasKey = false;
        this.mobChaseSpeed = 75;
        this.isSprinting = false;
        this.sprintDuration = 1500; 
        this.sprintCooldown = 3000; 
        this.sprintTimeRemaining = this.sprintDuration;
        this.sprintCooldownRemaining = 0;
        this.chaseMusicPlaying = false;
        this.isGameOver = false;
    }

    preload() {
        // Load tilemap
        this.load.tilemapTiledJSON("gameMap", "assets/tilemap/nightmare.json");

        // Load static sprites
        this.load.image("nightmare_spritesheet", "assets/tilemap/nightmare_spritesheet.png");
        this.load.image("mail", "assets/png/mail.png");
        this.load.image("mailbox", "assets/png/mailbox.png");
        this.load.image("mailbox_opened", "assets/png/mailbox_opened.png");
        this.load.image("door", "assets/png/door.png");
        this.load.image("door_opened", "assets/png/door_opened.png");
        this.load.image("key", "assets/png/key.png");
        this.load.image("ruinsBrick_broken", "assets/png/ruinsBrick_broken.png");
        this.load.image("ruinsBrick_normal", "assets/png/ruinsBrick_normal.png");
        this.load.image("ruinsTall_broken", "assets/png/ruinsTall_broken.png");
        this.load.image("ruinsTall_normal", "assets/png/ruinsTall_normal.png");
        this.load.image("tree_candle", "assets/png/tree_Candle.png");
        this.load.image("tree_normal", "assets/png/tree_Normal.png");
        this.load.image("tree_dead", "assets/png/tree_Dead.png");
        this.load.image("tree_fruit", "assets/png/tree_Fruit.png");
        this.load.image("tree_pine", "assets/png/tree_Pine.png");
        this.load.image("stella_dead", "assets/png/stella_Dead.png");
        this.load.image("gameover_txt", "assets/png/GameOver.png");

        // Load buttons
        this.load.image("btn_sleepForever", "assets/png/sign_SleepForever.png");
        this.load.image("btn_tryAgain", "assets/png/sign_TryAgain.png");

        // Load animated sprites
        this.load.spritesheet("mob_hand", "assets/png/mob_Hand.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("mob_skull", "assets/png/mob_Skull.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("mob_slug", "assets/png/mob_Slug.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("stella_walkBack", "assets/png/stella_WalkBack.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("stella_walkFront", "assets/png/stella_WalkFront.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("stella_walkLeft", "assets/png/stella_WalkLeft.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("stella_walkRight", "assets/png/stella_WalkRight.png", { frameWidth: 32, frameHeight: 32 });

        // Load audio
        this.load.audio("game_bgm", "assets/audio/Lonely little music boxoct1.wav");
        this.load.audio("button_click", "assets/audio/click on.wav");
        this.load.audio("death_sfx", "assets/audio/Sinking OMORI SFX.wav");
        this.load.audio("key_drop", "assets/audio/Key Drop OMORI SFX.wav");
        this.load.audio("mail_pickup", "assets/audio/Page Turn OMORI SFX.wav");
        this.load.audio("door_opened", "assets/audio/Unlocking Door OMORI SFX.wav");
        this.load.audio("chase_music", "assets/audio/getting closer variant.wav");
    }

    create() {
        this.physics.world.drawDebug = false;
        const map = this.make.tilemap({ key: "gameMap" });
        const tileset = map.addTilesetImage("nightmare_spritesheet", "nightmare_spritesheet");
    
        // Load tile layers
        const groundTile = map.createLayer("groundTile", tileset, 0, 0);
        const waterTile = map.createLayer("waterTile", tileset, 0, 0);
        const bridgeTile = map.createLayer("bridgeTile", tileset, 0, 0);
    
        // Water tile collision
        waterTile.setCollisionByProperty({ collidesWater: true });
    
        // Player and mob animations
        if (!this.anims.exists('stella_walkBack')) {
            this.anims.create({
                key: 'stella_walkBack',
                frames: this.anims.generateFrameNumbers('stella_walkBack', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }
        
        if (!this.anims.exists('stella_walkFront')) {
            this.anims.create({
                key: 'stella_walkFront',
                frames: this.anims.generateFrameNumbers('stella_walkFront', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists('stella_walkLeft')) {
            this.anims.create({
                key: 'stella_walkLeft',
                frames: this.anims.generateFrameNumbers('stella_walkLeft', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists('stella_walkRight')) {
            this.anims.create({
                key: 'stella_walkRight',
                frames: this.anims.generateFrameNumbers('stella_walkRight', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!this.anims.exists('mob_hand_anim')) {
            this.anims.create({
                key: 'mob_hand_anim',
                frames: this.anims.generateFrameNumbers('mob_hand', { start: 0, end: 11 }),
                frameRate: 10,
                repeat: -1
            });
        }
    
        if (!this.anims.exists('mob_skull_anim')) {
            this.anims.create({
                key: 'mob_skull_anim',
                frames: this.anims.generateFrameNumbers('mob_skull', { start: 0, end: 11 }),
                frameRate: 10,
                repeat: -1
            });
        }
    
        if (!this.anims.exists('mob_slug_anim')) {
            this.anims.create({
                key: 'mob_slug_anim',
                frames: this.anims.generateFrameNumbers('mob_slug', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }
    
        // Load objects
        this.loadObjects(map, "keyObj", "key", null, false, true);
        this.loadObjects(map, "doorObj", "door");
        this.loadObjects(map, "mailboxObj", "mailbox");
        this.loadObjects(map, "mailObj", "mail");
        this.loadObjects(map, "trees_normalObj", "tree_normal");
        this.loadObjects(map, "trees_fruitObj", "tree_fruit");
        this.loadObjects(map, "trees_deadObj", "tree_dead");
        this.loadObjects(map, "trees_candleObj", "tree_candle");
        this.loadObjects(map, "trees_pineObj", "tree_pine");
        this.loadObjects(map, "ruinsTall_normalObj", "ruinsTall_normal");
        this.loadObjects(map, "ruinsTall_brokenObj", "ruinsTall_broken");
        this.loadObjects(map, "ruinsBrick_normalObj", "ruinsBrick_normal");
        this.loadObjects(map, "ruinsBrick_brokenObj", "ruinsBrick_broken");
        this.loadObjects(map, "playerObj", "stella_walkFront", "stella_walkFront", true);
    
        // Set world bounds
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
    
        // Stop menu BGM, and play game BGM
        const menuBgm = this.sound.get('menu_bgm');
        if (menuBgm) {
            menuBgm.stop();
        }
    
        this.gameBgm = this.sound.add('game_bgm', { loop: true });
        this.gameBgm.play();
        
        // Sprint bar
        this.sprintBar = this.add.graphics();
        this.sprintBar.depth = 11; 
        this.updateSprintBar();
        this.sprintLabel = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 35, 'Stamina', { fontSize: '12px', fill: '#fff' });
        this.sprintLabel.depth = 11;
        this.sprintLabel.setOrigin(0.5, 0.5);
        this.sprintLabel.setScrollFactor(0);

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            SHIFT: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            DEBUG: Phaser.Input.Keyboard.KeyCodes.P
        });
    
        // Text UI
        this.mailText = this.add.text(10, 10, 'Mail collected: 0/10', { fontSize: '12px', fill: '#fff' }).setScrollFactor(0);
        this.keyText = this.add.text(10, 25, 'Key collected: 0/1', { fontSize: '12px', fill: '#fff' }).setScrollFactor(0);
        this.mailText.depth = 11;
        this.keyText.depth = 11;

        // Add colliders
        this.physics.add.collider(this.player, waterTile);
        this.addColliders(map);
    
        // Screen tint overlay
        const screenTint = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x010137, 0.15); 
        screenTint.setOrigin(0);
        screenTint.setScrollFactor(0);
        this.add.existing(screenTint);
    
        // Add overlap
        this.physics.add.overlap(this.player, this.mailObjects, this.collectMail, null, this);
        this.physics.add.overlap(this.player, this.mailboxObjects, this.checkMailbox, null, this);
        this.physics.add.overlap(this.player, this.doorObjects, this.checkDoor, null, this);
        
        // Mob initialization
        this.mobs = [];
        map.getObjectLayer('mob_slugObj').objects.forEach(object => {
            const slug = this.physics.add.sprite(object.x, object.y, 'mob_slug').play('mob_slug_anim');
            slug.spawnPoint = { x: object.x, y: object.y };
            slug.chaseDistance = 10 * map.tileWidth; 
            slug.setData('isAtSpawn', true); 
            slug.setVisible(false);
            this.mobs.push(slug);
        });

        map.getObjectLayer('mob_handObj').objects.forEach(object => {
            const hand = this.physics.add.sprite(object.x, object.y, 'mob_hand').play('mob_hand_anim');
            hand.spawnPoint = { x: object.x, y: object.y };
            hand.chaseDistance = 10 * map.tileWidth; 
            hand.setData('isAtSpawn', true); 
            hand.setVisible(false);
            this.mobs.push(hand);
        });

        map.getObjectLayer('mob_skullObj').objects.forEach(object => {
            const skull = this.physics.add.sprite(object.x, object.y, 'mob_skull').play('mob_skull_anim');
            skull.spawnPoint = { x: object.x, y: object.y };
            skull.chaseDistance = 10 * map.tileWidth; 
            skull.setData('isAtSpawn', true); 
            skull.setVisible(false);
            this.mobs.push(skull);
        });
    
        // Out of bound colliders
        this.mobs.forEach(mob => {
            this.physics.add.collider(mob, waterTile);
            this.addCollidersToMob(mob, map);
            this.physics.add.collider(mob, this.physics.world.bounds); 
        });
    
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.physics.world.bounds);
        this.mobs.forEach(mob => {
            this.physics.add.collider(mob, this.physics.world.bounds);
        });

        // Reset player velocity and animations
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.player.anims.stop();
    }
    
    loadObjects(map, objectLayerName, spriteName, animKey = null, animated = false, invisible = false) {
        try {
            const layer = map.getObjectLayer(objectLayerName);
            if (!layer) throw `Layer ${objectLayerName} does not exist in the map.`;
            const objects = layer.objects;
            objects.forEach(object => {
                if (spriteName && this.textures.exists(spriteName)) {
                    const sprite = this.physics.add.sprite(object.x, object.y, spriteName);
                    sprite.setOrigin(0.5, 0.75);
                    if (objectLayerName === "playerObj") {
                        this.player = sprite;
                        sprite.depth = 8;
                    } else if (objectLayerName.includes("mob_")) {
                        sprite.depth = 9;
                    } else {
                        sprite.depth = 10;
                    }
                    if (objectLayerName === "mailObj") {
                        if (!this.mailObjects) this.mailObjects = this.physics.add.group();
                        this.mailObjects.add(sprite);
                        sprite.setData('collected', false);
                    }
                    if (objectLayerName === "keyObj") {
                        this.key = sprite;
                        this.key.setVisible(false);
                    }
                    if (objectLayerName === "mailboxObj") {
                        if (!this.mailboxObjects) this.mailboxObjects = this.physics.add.group();
                        this.mailboxObjects.add(sprite);
                        sprite.isOpen = false;
                    }
                    if (objectLayerName === "doorObj") {
                        if (!this.doorObjects) this.doorObjects = this.physics.add.group();
                        this.doorObjects.add(sprite);
                        sprite.isOpen = false;
                    }
                    if (animated && animKey) {
                        sprite.play(animKey);
                    }
                } else {
                    console.warn(`Sprite ${spriteName} does not exist.`);
                }
            });
        } catch (error) {
            console.error(`Error loading objects for layer ${objectLayerName}:`, error);
        }
    }
    
    addColliders(map) {
        const collidableObjects = [
            { name: "trees_normalObj", width: 1 },
            { name: "trees_fruitObj", width: 1 },
            { name: "trees_deadObj", width: 1 },
            { name: "trees_candleObj", width: 1 },
            { name: "trees_pineObj", width: 1 },
            { name: "ruinsTall_normalObj", width: 1 },
            { name: "ruinsTall_brokenObj", width: 1 },
            { name: "ruinsBrick_normalObj", width: 1 },
            { name: "ruinsBrick_brokenObj", width: 1 },
            { name: "doorObj", width: 1 },
            { name: "mailboxObj", width: 1 },
        ];

        collidableObjects.forEach(obj => {
            const objects = map.getObjectLayer(obj.name).objects;
            objects.forEach(object => {
                const collider = this.add.rectangle(object.x, object.y, object.width * obj.width, object.height, 0x0000ff, 0);
                this.physics.add.existing(collider, true);
                this.physics.add.collider(this.player, collider);
            });
        });
    }

    addCollidersToMob(mob, map) {
        const collidableObjects = [
            "trees_normalObj",
            "trees_fruitObj",
            "trees_deadObj",
            "trees_candleObj",
            "trees_pineObj",
            "ruinsTall_normalObj",
            "ruinsTall_brokenObj",
            "ruinsBrick_normalObj",
            "ruinsBrick_brokenObj",
        ];

        collidableObjects.forEach(objName => {
            const objects = map.getObjectLayer(objName).objects;
            objects.forEach(object => {
                const collider = this.add.rectangle(object.x, object.y, object.width, object.height, 0x0000ff, 0);
                this.physics.add.existing(collider, true);
                this.physics.add.collider(mob, collider);
            });
        });
    }

    // Mob chasing AI
    updateMobs() {
        let isPlayerNearMob = false;
        this.mobs.forEach(mob => {
            const distanceToPlayer = Phaser.Math.Distance.Between(mob.x, mob.y, this.player.x, this.player.y);
    
            if (distanceToPlayer < mob.chaseDistance) {
                this.physics.moveToObject(mob, this.player, this.mobChaseSpeed);
                mob.setData('isAtSpawn', false); 
                mob.setVisible(true); 
                isPlayerNearMob = true;
            } else {
                if (!mob.getData('isAtSpawn')) {
                    this.physics.moveToObject(mob, mob.spawnPoint, this.mobChaseSpeed);
                    mob.setVisible(true);
                }
    
                if (Phaser.Math.Distance.Between(mob.x, mob.y, mob.spawnPoint.x, mob.spawnPoint.y) < 10) {
                    mob.body.reset(mob.spawnPoint.x, mob.spawnPoint.y);
                    mob.setData('isAtSpawn', true);
                    mob.setVisible(true);
                }
            }
        });
    
        if (isPlayerNearMob) {
            if (!this.chaseMusicPlaying) {
                this.gameBgm.pause();
                this.chaseMusic = this.sound.add('chase_music', { loop: true });
                this.chaseMusic.play();
                this.chaseMusicPlaying = true;
            }
        } else {
            if (this.chaseMusicPlaying) {
                this.chaseMusic.stop();
                this.gameBgm.resume();
                this.chaseMusicPlaying = false;
            }
        }
    }

    collectMail(player, mail) {
        if (!mail.getData('collected')) {
            mail.destroy();
            this.mailCollected += 1;
            this.mailText.setText(`Mail collected: ${this.mailCollected}/10`);
            this.sound.play('mail_pickup');
            mail.setData('collected', true);
        }
    }

    checkMailbox(player, mailbox) {
        if (this.mailCollected >= 10) {
            if (!mailbox.isOpen) {
                mailbox.isOpen = true;
                mailbox.setTexture("mailbox_opened");
                this.key.setVisible(true);
                this.sound.play('key_drop');
                this.physics.add.overlap(this.player, this.key, this.collectKey, null, this);
                mailbox.body.enable = false;
            }
        } else {
            this.tintObject(mailbox);
        }
    }

    collectKey(player, key) {
        key.destroy();
        this.hasKey = true;
        this.keyText.setText('Key collected: 1/1');
    }

    checkDoor(player, door) {
        if (this.hasKey) {
            if (!door.isOpen) {
                door.isOpen = true;
                door.setTexture("door_opened");
                this.sound.play('door_opened');
                door.body.enable = false;
                this.time.delayedCall(1000, () => {
                    this.gameBgm.stop(); // Stop the game BGM
                    this.scene.start('FinalCutscene');
                });
            }
        } else {
            this.tintObject(door);
        }
    } 

    tintObject(object) {
        const originalTint = object.tint;
        object.setTint(0xA9A9A9); 
        this.time.delayedCall(500, () => {
            object.clearTint();
        });
    }

    updateSprintBar() {
        this.sprintBar.clear();
        
        const barWidth = 100;
        const barHeight = 10;
        const barX = (this.cameras.main.width - barWidth) / 2;
        const barY = this.cameras.main.height - 20;
        
        // Background bar
        this.sprintBar.fillStyle(0x000000, 1);
        this.sprintBar.fillRect(barX, barY, barWidth, barHeight);
        
        // Foreground bar
        let sprintRatio = this.sprintTimeRemaining / this.sprintDuration;
        this.sprintBar.fillStyle(0xFFD700, 1);
        this.sprintBar.fillRect(barX, barY, barWidth * sprintRatio, barHeight);

        this.sprintBar.setScrollFactor(0);
    }

    update(time, delta) {
        if (this.isGameOver){
            return;
        }

        if (this.player.isDead) {
            return; 
          }

        this.player.body.setVelocity(0, 0);
        let playerSpeed = 100;

        if (this.keys.SHIFT.isDown && this.sprintCooldownRemaining <= 0) {
            this.isSprinting = true;
        } else if (this.sprintTimeRemaining <= 0 || !this.keys.SHIFT.isDown) {
            this.isSprinting = false;
        }

        if (this.isSprinting) {
            playerSpeed = 150; 
            this.sprintTimeRemaining -= delta;

            if (this.sprintTimeRemaining <= 0) {
                this.sprintTimeRemaining = 0;
                this.sprintCooldownRemaining = this.sprintCooldown;
            }
        } else {
            if (this.sprintTimeRemaining < this.sprintDuration) {
                this.sprintTimeRemaining += delta / 2; 
            }
            if (this.sprintCooldownRemaining > 0) {
                this.sprintCooldownRemaining -= delta;
                if (this.sprintCooldownRemaining < 0) {
                    this.sprintCooldownRemaining = 0;
                }
            }
        }

        this.updateSprintBar();

        if (this.keys.W.isDown) {
            this.player.body.setVelocityY(-playerSpeed);
            this.player.anims.play("stella_walkBack", true);
        } else if (this.keys.S.isDown) {
            this.player.body.setVelocityY(playerSpeed);
            this.player.anims.play("stella_walkFront", true);
        } else if (this.keys.A.isDown) {
            this.player.body.setVelocityX(-playerSpeed);
            this.player.anims.play("stella_walkLeft", true);
        } else if (this.keys.D.isDown) {
            this.player.body.setVelocityX(playerSpeed);
            this.player.anims.play("stella_walkRight", true);
        } else {
            this.player.anims.stop();
        }

    // Debug key handling
    if (Phaser.Input.Keyboard.JustDown(this.keys.DEBUG)) {
        this.mailCollected = 10; // Update the mailCollected variable
        this.mailText.setText('Mail collected: 10/10');
    }

        this.mobs.forEach(mob => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), mob.getBounds())) {
                this.gameOver();
            }
        });

        this.updateMobs();   
    }

    gameOver() {
        this.isGameOver = true;
        this.gameBgm.stop();
        if (this.chaseMusic) {
            this.chaseMusic.stop();
        }
        this.sound.play('death_sfx');
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.player.anims.stop();
        this.player.destroy();
        this.mobs.forEach(mob => {
            mob.body.velocity.x = 0;
            mob.body.velocity.y = 0;
        });

        this.sprintTimeRemaining = this.sprintDuration;
        this.sprintCooldownRemaining = 0;

        const stellaDead = this.physics.add.sprite(this.player.x, this.player.y, 'stella_dead');
        stellaDead.setScale(1); 
        stellaDead.setDepth(8);
        stellaDead.setDepth(this.player.depth);
        stellaDead.setActive(true);
        stellaDead.setVisible(true);
        this.tweens.add({
            targets: stellaDead,
            y: stellaDead.y,
            duration: 500,
            ease: 'Power2'
        });        
        
        const gameOverText = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 25, 'gameover_txt');
        gameOverText.setScale(1.05); 
        gameOverText.setDepth(9);
        gameOverText.setScrollFactor(0);
        
        const tryAgainButton = this.add.image(this.cameras.main.width / 2 - 100, this.cameras.main.height / 2 + 50, 'btn_tryAgain');
        tryAgainButton.setScale(0.15);
        tryAgainButton.setScrollFactor(0);
        tryAgainButton.setInteractive();
        tryAgainButton.on('pointerdown', () => {
            this.sound.play('button_click');
            this.scene.restart();
        });
        
        tryAgainButton.on('pointerover', () => {
            tryAgainButton.setTint(0xA9A9A9);
        });
        tryAgainButton.on('pointerout', () => {
            tryAgainButton.clearTint();
        });
        tryAgainButton.setDepth(15); // set the z-index of the button
        
        const sleepForeverButton = this.add.image(this.cameras.main.width / 2 + 100, this.cameras.main.height / 2 + 50, 'btn_sleepForever');
        sleepForeverButton.setScale(0.15);
        sleepForeverButton.setScrollFactor(0);
        sleepForeverButton.setInteractive();
        sleepForeverButton.on('pointerdown', () => {
            this.sound.play('button_click');
            this.scene.start('MainMenu');
        });               
        sleepForeverButton.on('pointerover', () => {
            sleepForeverButton.setTint(0xA9A9A9);
        });
        sleepForeverButton.on('pointerout', () => {
            sleepForeverButton.clearTint();
        });
        sleepForeverButton.setDepth(15); // set the z-index of the button
    }    
}