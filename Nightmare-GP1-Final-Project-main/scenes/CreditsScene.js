export class CreditsScene extends Phaser.Scene {
    constructor() {
        super("CreditsScene");
    }

    preload() {
        // Load images
        this.load.image("bg_image", "assets/png/Nightmare(cover).png");
        this.load.image("button_back", "assets/png/sign_Back.png");

        // Load audio
        this.load.audio("button_click", "assets/audio/click on.wav");
    }

    create() {
        const background = this.add.image(0, 0, "bg_image").setOrigin(0, 0).setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setTint(0x808080); 

        const textContent = `
        Game Developed By:
        
        4Fusion Tech
        
        Dela Casa, Angelica Grace G.
        Abrenilla, Louis Martin T.
        Historia, Angelo Bon T.
        Rubino, Mike Juri P.
        


        Thank you for playing!
        


        Copyright © 2024 4FusionTech
        All rights reserved.`;

        const creditsText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, textContent, {
            fontSize: '20px', 
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: this.cameras.main.width - 100 }
        }).setOrigin(0.6, 0.35);

        // Button click sound
        this.buttonClick = this.sound.add("button_click", { volume: 0.5 });

        // Back button
        const buttonScale = 0.15; 
        const exitButton = this.add.image(this.cameras.main.centerX, this.cameras.main.height - 50, "button_back");
        exitButton.setScale(buttonScale);
        exitButton.setInteractive();

        exitButton.on('pointerover', () => {
            exitButton.setTint(0xA9A9A9);
        });

        exitButton.on('pointerout', () => {
            exitButton.clearTint();
        });

        exitButton.on('pointerup', () => {
            this.buttonClick.play();
            this.scene.start('MainMenu'); 
        });
    }
}
