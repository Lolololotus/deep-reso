export const EN_DICTIONARY = {
    categories: {
        emotion_shield: {
            id: 'emotion_shield',
            words: ["cringe", "gross", "overrated", "lit", "basic"],
            responses: [
                "Don't use borrowed emotions. Dig deeper into the specific sensation behind that label.",
                "You are hiding behind a shield of irony. Lower it and speak with vulnerability.",
                "That word is a wall, not a bridge. dismantle it."
            ]
        },
        avoidance: {
            id: 'avoidance',
            words: ["just", "maybe", "idk", "whatever", "dunno", "guess"],
            responses: [
                "Your indecision is polluting the signal. Salvage a clear thought from your internal abyss.",
                "'Just' is a word that minimizes your existence. Speak with intent.",
                "Silence is better than noise. But true signal is better than silence. Try again."
            ]
        },
        flat_praise: {
            id: 'flat_praise',
            words: ["awesome", "amazing", "crazy", "goat", "cool", "nice"],
            responses: [
                "Flat adjectives are the enemy of resolution. Describe the architecture of your admiration.",
                "Do not reduce the sublime to a single generic label. Sculpt your praise.",
                "Resolution too low. Analyze the spectrum of your feeling."
            ]
        },
        memes: {
            id: 'memes',
            words: ["skibidi", "rizz", "gyatt", "fanum", "cap", "no cap"],
            responses: [
                "You are reciting someone else's script. Cut the strings.",
                "Meme viral viral... entropy. Restore your own voice.",
                "That is not a thought; it is an echo. Stop echoing."
            ]
        }
    },
    special: {
        masked_positivity: {
            trigger: "it is what it is",
            response: "Resignation masquerading as wisdom. Define specifically what 'it' is."
        }
    },
    errors: {
        low_density: "Thought density too low for high-pressure depths. Construct a structure that can survive.",
    },
    rewards: {
        fog_clearing: [
            "The fog is lifting. Continue your dive.",
            "Signal clarity increasing. You are approaching the core.",
            "A distinct waveform detected. Proceed."
        ]
    }
};
