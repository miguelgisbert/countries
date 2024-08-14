import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { useNavigate } from 'react-router-dom'
import Range from './range'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Country {
  name: string
  population: number
  region: string
}

interface PopulationByContinent {
  [key: string]: number
}

const Continents: React.FC = () => {
  const [populations, setPopulations] = useState<PopulationByContinent>({})
  const [filteredPopulations, setFilteredPopulations] = useState<PopulationByContinent>({})
  const [minRange, setMinRange] = useState<number>(0)
  const [maxRange, setMaxRange] = useState<number>(5)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('https://restcountries.com/v2/all')
      .then(response => {
        console.log(response)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(data => {
        const populationByContinent = data.reduce((acc: PopulationByContinent, country: Country) => {
          const continent = country.region
          if (continent) {
            acc[continent] = (acc[continent] || 0) + country.population
          }
          return acc
        }, {})
  
        setPopulations(populationByContinent)
      })
      .catch(error => console.error('Error fetching countries:', error))
  }, [])

  useEffect(() => {
    const filtered = Object.keys(populations).reduce((acc: PopulationByContinent, continent: string) => {
      const population = populations[continent] / 1_000_000_000;
      if (population >= minRange && population <= maxRange) {
        acc[continent] = populations[continent];
      }
      return acc;
    }, {});

    setFilteredPopulations(filtered);
  }, [populations, minRange, maxRange]);

  const handleRangeChange = (min: number, max: number) => {
    setMinRange(min);
    setMaxRange(max);
  }

  const data = {
    labels: Object.keys(filteredPopulations),
    datasets: [
      {
        label: 'Population by Continent',
        data: Object.values(filteredPopulations).map(population => population / 1_000_000_000),
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
            return `${tooltipItem.raw.toFixed(1)} B inhabitants`
          }
        }
      }
    },
    onClick: (event: any) => {
      const chart = event.chart;
      const elements = chart.getElementsAtEventForMode(event.native, 'nearest', { intersect: true }, true)

      if (elements.length) {
        const index = elements[0].index
        const continent = data.labels[index]
        navigate(`/countries/${continent}`)
      }
    }
  }

  return (
    <div>
      <h1>Population by Continent</h1>
      <Range min={minRange} max={maxRange} onRangeChange={handleRangeChange} type={"B"} />
      <Bar 
        data={data} 
        options={options} 
      />
    </div>
  );
};

export default Continents;
