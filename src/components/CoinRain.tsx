import { useEffect, useState } from 'react';
import { Coins, CircleDollarSign, DollarSign } from 'lucide-react';

interface Coin {
  id: number;
  left: number;
  duration: number;
  delay: number;
  size: number;
  icon: number;
}

const CoinRain = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const icons = [Coins, CircleDollarSign, DollarSign];

  useEffect(() => {
    const generateCoins = () => {
      const newCoins: Coin[] = [];
      for (let i = 0; i < 15; i++) {
        newCoins.push({
          id: i,
          left: Math.random() * 100,
          duration: 8 + Math.random() * 6,
          delay: Math.random() * 5,
          size: 30 + Math.random() * 30,
          icon: Math.floor(Math.random() * icons.length),
        });
      }
      setCoins(newCoins);
    };

    generateCoins();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {coins.map((coin) => {
        const IconComponent = icons[coin.icon];
        return (
          <IconComponent
            key={coin.id}
            className="absolute animate-fall text-accent opacity-70"
            size={coin.size}
            style={{
              left: `${coin.left}%`,
              animationDuration: `${coin.duration}s`,
              animationDelay: `${coin.delay}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default CoinRain;
