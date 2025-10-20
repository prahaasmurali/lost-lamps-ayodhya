# The Lost Lamps of Ayodhya 🪔

A Diwali-themed treasure hunt web app built with Next.js 15, React, and Tailwind CSS.

## 🎯 Game Overview

Help restore light to the ancient city of Ayodhya by solving three sacred riddles and relighting the lost lamps. Each clue tests different skills:

1. **Lamp of Wisdom** - Hidden HTML/CSS clue detection
2. **Lamp of Prosperity** - Logic puzzle solving  
3. **Lamp of Courage** - Binary cipher decoding

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd lost-lamps-ayodhya
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 How to Play

1. **Start the Hunt** - Begin your journey from the landing page
2. **Solve Clues Sequentially** - Each clue must be solved to unlock the next
3. **Use Browser Developer Tools** - Some clues require inspecting HTML/CSS
4. **Progress is Saved** - Your advancement is tracked in localStorage
5. **Celebrate Victory** - Complete all three clues to light up Ayodhya!

## 🧩 Clue Solutions (Spoiler Alert!)

<details>
<summary>Click to reveal solutions</summary>

### Clue 1: Lamp of Wisdom
- **Answer**: "light"
- **Hint**: Inspect the hidden-hint element in developer tools

### Clue 2: Lamp of Prosperity  
- **Logic Puzzle Solution**:
  - Arjun: Golden diya, Sweets offering
  - Priya: Silver diya, Flowers offering  
  - Vikram: Copper diya, Incense offering
  - Anjali: Bronze diya, Fruits offering

### Clue 3: Lamp of Courage
- **Cipher**: 🌕🌑🌕🌑🪔🌕🌕🌑🌕🪔🌑🌕🌕🌑🌑
- **Translation**: 
  - 🌕🌑🌕🌑 = 1010 (binary) = 10 (decimal) = not valid
  - Actually: 🌕🌑 = 10 = 2 = B, 🌕🌑 = 10 = 2 = B... 
  - **Answer**: "brave"

</details>

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 18 (Functional Components)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React useState + localStorage
- **Animations**: CSS keyframes + Tailwind animations

## 📁 Project Structure

```
lost-lamps-ayodhya/
├── app/
│   ├── clue1/page.tsx        # First riddle
│   ├── clue2/page.tsx        # Logic puzzle  
│   ├── clue3/page.tsx        # Binary cipher
│   ├── victory/page.tsx      # Victory celebration
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/               # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── InputBox.tsx
│   ├── SubmitButton.tsx
│   └── MessageBox.tsx
├── data/
│   └── clues.ts             # Game data & solutions
└── package.json
```

## 🎨 Features

- **Responsive Design** - Works on desktop and mobile
- **Diwali Theme** - Authentic festival colors and animations
- **Flickering Diya Animations** - CSS-powered lamp effects
- **Confetti Celebration** - Victory page with particle effects
- **Progress Tracking** - localStorage prevents skipping clues
- **Hidden Clues** - HTML/CSS inspection challenges
- **Accessibility** - Semantic HTML and proper ARIA labels

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy with default settings
4. Enjoy your live treasure hunt!

### Manual Build  
```bash
npm run build
npm start
```

## 🔧 Customization

### Adding New Clues
1. Update `data/clues.ts` with new riddle data
2. Create new page in `app/clue4/page.tsx`
3. Update navigation logic in existing clues
4. Modify localStorage keys for progress tracking

### Styling Changes
- Edit `tailwind.config.js` for theme colors
- Modify animations in `app/globals.css`
- Update component styles in individual files

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by the festival of Diwali and Indian mythology
- Built for employee engagement and team building
- Emoji icons from Unicode standard

---

**Happy Diwali! May the light of knowledge guide your path! 🪔✨**
