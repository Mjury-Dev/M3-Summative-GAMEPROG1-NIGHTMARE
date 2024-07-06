export class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    preload() {
        // Load images
        this.load.image("bg_image", "assets/png/Nightmare(cover).png");
        this.load.image("btn_credits", "assets/png/sign_Credits.png");
        this.load.image("btn_wakeUp", "assets/png/sign_WakeUp.png");
        this.load.image("btn_exit", "assets/png/sign_ExitGame.png");
        this.load.image("btn_howtoplay", "assets/png/sign_HowToPlay.png");

        // Load audio
        this.load.audio("menu_bgm", "assets/audio/Menu Music.wav");
        this.load.audio("button_click", "assets/audio/click on.wav");
    }

    create() {
        // Add background image
        this.add.image(0, 0, "bg_image").setOrigin(0, 0).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Background music
        if (!this.sound.get('menu_bgm')) {
            this.menuBgm = this.sound.add("menu_bgm", { loop: true, volume: 0.5 });
            this.menuBgm.play();
        } else {
            this.menuBgm = this.sound.get('menu_bgm');
        }

        if (!this.sound.get('menu_bgm').isPlaying) {
            this.sound.play('menu_bgm', { loop: true });
        }

        this.buttonClick = this.sound.add("button_click", { volume: 0.5 });

        // Create buttons
        const buttonScale = 0.15;
        const buttonY = this.cameras.main.height / 2 + 250;
        const buttonSpacing = 150;

        const wakeUpButton = this.add.image(this.cameras.main.centerX - 1.5 * buttonSpacing, buttonY, "btn_wakeUp");
        const howtoplayButton = this.add.image(this.cameras.main.centerX - 0.5 * buttonSpacing, buttonY, "btn_howtoplay");
        const creditsButton = this.add.image(this.cameras.main.centerX + 0.5 * buttonSpacing, buttonY, "btn_credits");
        const exitButton = this.add.image(this.cameras.main.centerX + 1.5 * buttonSpacing, buttonY, "btn_exit");

        [wakeUpButton, howtoplayButton, creditsButton, exitButton].forEach(button => {
            button.setScale(buttonScale);
            button.setInteractive();

            // Button effects
            button.on('pointerover', () => {
                button.setTint(0xA9A9A9);
            });

            button.on('pointerout', () => {
                button.clearTint();
            });

            button.on('pointerup', () => {
                this.buttonClick.play();
            });
        });

        // Wake Up button
        wakeUpButton.on('pointerup', () => {
            this.sound.play('button_click');
            this.menuBgm.stop(); 
            this.scene.start('GameScene', {
                mailCollected: 0,
                hasKey: false,
                sprintTimeRemaining: 1500,
                sprintCooldownRemaining: 0,
                isGameOver: false,
                    });
                });

        // How to play button
        howtoplayButton.on('pointerup', () => {
            this.scene.start('HowToPlayScene');
            this.buttonClick.play();
        });

        // Credits button
        creditsButton.on('pointerup', () => {
            this.scene.start('CreditsScene');
            this.buttonClick.play();
        });

        // Exit button
        exitButton.on('pointerup', () => {
            window.close();
        });
    }
}
