module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-slate-600',
    'bg-gray-600',
    'bg-zinc-600',
    'bg-neutral-600',
    'bg-stone-600',
    'bg-red-600',
    'bg-orange-600',
    'bg-amber-600',
    'bg-yellow-600',
    'bg-lime-600',
    'bg-green-600',
    'bg-emerald-600',
    'bg-teal-600',
    'bg-cyan-600',
    'bg-sky-600',
    'bg-blue-600',
    'bg-indigo-600',
    'bg-violet-600',
    'bg-purple-600',
    'bg-fuchsia-600',
    'bg-pink-600',
    'bg-rose-600',
  ],
  theme: {
    extend: {
      spacing: {
        106: '24rem',
        112: '28rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes
    }),
  ],
};
