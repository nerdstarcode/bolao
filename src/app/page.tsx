'use client'
import axios from 'axios';
import Image from 'next/image'
import { useEffect, useState } from 'react';
const jogos = [
  [3, 7, 14, 17, 19, 21, 22, 24, 26, 28, 30, 32, 52, 55],
  [9, 11, 14, 17, 26, 31, 32, 40, 46, 54],
  [5, 6, 9, 12, 21, 36, 48, 50, 57],
  [4, 10, 21, 40, 43, 51, 59, 60],
  [1, 6, 13, 16, 21, 24, 49],
  [7, 13, 22, 23, 45, 47, 52],
  [3, 16, 23, 34, 35, 54, 60],
  [4, 6, 21, 28, 34, 45],
  [4, 7, 9, 13, 31, 57],
  [14, 22, 25, 39, 45, 52],
  [11, 15, 17, 29, 51, 52]
]
const acertos: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const numerosSorteados = [1, 5, 7, 9, 0, 3]
export default function Home() {
  const [reload, setReload] = useState(true)
  const [resultados, setResultados] = useState<number[]>([]);
  const [refresh, setRefresh] = useState(false)
  const [premios, setPremios] = useState<{
    "descricao": string,
    "faixa": number,
    "ganhadores": number,
    "valorPremio": number
  }[]>([]);
  const fetchData = async () => {
    try {
      setReload(true)
      const response = await axios.get('https://loteriascaixa-api.herokuapp.com/api/megasena/latest');
      setReload(false)
      setResultados(response.data.dezenasOrdemSorteio.map((number: string) => Number(number)));
      setPremios(response.data.premiacoes)
    } catch (error) {
      console.error('Erro ao obter resultados:', error);
    } finally {
      // Configura a próxima chamada após 10 segundos, garantindo que não acumule chamadas se a resposta demorar
      setTimeout(fetchData, 10000);
    }
  };
  useEffect(() => {
    fetchData()
  }, []);

  return (
    <main className="flex w-full h-full flex-col items-center">
      <section className='flex flex-col w-full items-center my-10'>
        <h4 className='flex items-center gap-4 '>
          Numeros sorteados {reload ?
            <div className='w-4 h-4 rounded-full border-4 border-gray-600' />
            :
            null
          }
        </h4>
        <div className='flex gap-4 font-bold text-green-400 text-2xl'>

          {resultados.map(number => <div>{number}</div>)}
        </div>
      </section>
      <section className='grid grid-cols-1 gap-2 md:grid-cols-3 w-full place-items-center my-4'>
        {premios.map((premio) => {
          const acertosNumber = parseInt(premio.descricao.match(/\d+/)?.[0] || '6', 10);
          const ganhamu = acertos.find(number => number >= acertosNumber) !== undefined
          return (
            <article className={`${ganhamu ? 'bg-blue-400 ' : 'bg-gray-700'} rounded-lg p-4 w-48`}>
              <h4 className={`w-full text-center  ${ganhamu ? 'bg-blue-950 text-white' : 'bg-slate-950 text-gray-400'} rounded py-1`}>{premio.descricao}</h4>
              <div>
                Faixa: {premio.faixa}
              </div>
              <div>
                Ganhadores: {premio.ganhadores}
              </div>
              <div>
                Premio: R${premio.valorPremio}
              </div>
            </article>
          )
        })}
      </section>
      <section className='grid grid-cols-2 lg:grid-cols-11 md:grid-cols-7 sm:grid-cols-5 w-full place-items-center px-10 justify-around items-center'>
        {jogos.map((jogo, index) => {
          const numeroDeAcertos = jogo.filter(valor => resultados.includes(valor));
          acertos[index] = numeroDeAcertos.length
          return (
            <article className='text-center'>
              <h3>Acertos</h3>
              <h4>{acertos[index]}</h4>
              <div className='grid grid-cols-2 gap-4'>
                {jogo.map((Number) => {
                  return (
                    <div
                      className={`
                      text-center 
                      rounded 
                      px-2 py-1 
                      text-white
                      ${resultados.includes(Number) ? 'bg-blue-400' : 'bg-gray-500'}
                    `}>
                      {Number}
                    </div>)
                })}
              </div>
            </article>
          )
        })}
      </section>


    </main>
  )
}
