// src/components/Continents.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registra els components de Chart.js necessaris
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Defineix una interfície per al tipus de dades que esperem de l'API
interface Country {
  name: string;
  population: number;
  region: string;
}

interface PopulationByContinent {
  [key: string]: number;
}

const Continents: React.FC = () => {
  const [populations, setPopulations] = useState<PopulationByContinent>({});

  useEffect(() => {
    // Crida a l'API per obtenir totes les dades dels països
    axios.get<Country[]>('https://restcountries.com/v2/all')
      .then(response => {
        const data = response.data;
        console.log(data)

        // Agrupa la població per continent
        const populationByContinent = data.reduce((acc: PopulationByContinent, country: Country) => {
          const continent = country.region;
          if (continent) {
            acc[continent] = (acc[continent] || 0) + country.population;
          }
          return acc;
        }, {});

        // Estableix les dades agrupades en l'estat
        setPopulations(populationByContinent);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  // Prepara les dades per a la gràfica
  const data = {
    labels: Object.keys(populations),
    datasets: [
      {
        label: 'Population by Continent',
        data: Object.values(populations).map(population => population / 1_000_000_000),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Formateja els valors com a milions amb un decimal
          callback: function(value: number | string) {
            return `${value} B`;
          }
        },
        title: {
          display: true,
          text: 'Population (billions)',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem: any) {
            return `${tooltipItem.raw.toFixed(1)} B habitants`;
          }
        }
      }
    }
  }

  return (
    <div>
      <h1>Population by Continent</h1>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Continents;
