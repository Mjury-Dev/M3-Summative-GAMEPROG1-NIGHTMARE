export class HowToPlayScene extends Phaser.Scene {
    constructor() {
        super("HowToPlayScene");
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
        Controls:

        W: Walk up
        A: Walk left
        S: Walk down
        D: Walk right
        SHIFT: Run for a short period of time
        


        Story synopsis:
        
        In this game, you play as Stella, a girl who awakens in what seems to be a dream. However, this is no ordinary dream; it's set in a dark, eerie, and unknown forest. It feels more like a nightmare. Beside Stella are a door and a mailbox, their purpose unclear. The chilling atmosphere compels Stella to escape, but she's unsure how. Then, a whispery voice echoes in her mind, providing the way out: collect ten envelopes scattered around the area and deliver them to the mailbox, which will then provide a key to open the door and escape. 
        
        Driven by a strong desire to leave this unsettling place, Stella reluctantly follows the voice's instructions, venturing into the ominous woods with a lingering sense of dread. Unbeknownst to her, this journey will be fraught with danger, as monsters and obstacles lie in wait. 
        
        The player must guide Stella in finding all ten envelopes. Her fate rests in the player's hands: will she escape the nightmare, or be trapped in it forever? 
        `;

        const creditsText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, textContent, {
            fontSize: '15px', 
            color: '#ffffff',
            align: 'left',
            wordWrap: { width: this.cameras.main.width - 25 }
        }).setOrigin(0.5, 0.35);

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
