import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../../service/api";
import styles from "./home.module.css";
import { BsSearch } from "react-icons/bs";
import { OrbitProgress } from "react-loading-indicators";

export interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  marketCapUsd: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  volumeUsd24Hr: string;
  explorer: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProps {
  data: CoinProps[];
}

export function Home() {
  const [input, setInput] = useState<string>("");
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [limit, setLimit] = useState(10);
  const [loading, setloading] = useState(false);
  const [isFirstLoad, setFirstLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [limit]);

  async function getData() {
    try {
      setloading(true);
      const response = await api.get<DataProps>("/assets");
      const coinsData = response.data.data.slice(0, limit);

      setCoins(coinsData);
      console.log(coinsData);

      const price = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });
      const priceCompact = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
      });

      const formatedResult = coinsData.map((item) => {
        const formated = {
          ...item,
          formatedPrice: price.format(Number(item.priceUsd)),
          formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
          formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
        };
        return formated;
      });

      console.log(formatedResult);
      setCoins(formatedResult);
      setloading(false);
      setFirstLoad(false);
    } catch (error) {
      console.log(error);
    }
  }
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (input === "") return;
    navigate(`/detail/${input}`);
  }
  
  function handleGetMore() {
    setLimit((valorAtual) => valorAtual + 10);
  }
  
  const tolowercaseBusca = input.toLowerCase();
  const filtroCoin = coins.filter(
    (c) =>
      c.name.toLowerCase().startsWith(tolowercaseBusca) ||
      c.symbol.toLowerCase().startsWith(tolowercaseBusca)
  );

  if (isFirstLoad || !coins) {
    return (
      <div className={styles.container}>
        <h1 className={styles.center}>Carregando detalhes</h1>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Digite o nome da moeda... Ex Bitcoin"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#fff" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor Mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança 24hr</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {filtroCoin.length > 0 &&
            filtroCoin.map((item) => (
              <tr className={styles.tr} key={item.id}>
                <td className={styles.tdlabel} data-label="Moeda">
                  <div className={styles.name}>
                    <img
                      className={styles.logo}
                      src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
                      alt="logo cripto"
                    />

                    <Link to={`/detail/${item.id}`}>
                      <span>{item.name}</span> | {item.symbol}
                    </Link>
                  </div>
                </td>

                <td className={styles.tdlabel} data-label="Valor Mercado">
                  {item.formatedMarket}
                </td>
                <td className={styles.tdlabel} data-label="Preço">
                  {item.formatedPrice}
                </td>
                <td className={styles.tdlabel} data-label="Volume">
                  {item.formatedVolume}
                </td>
                <td
                  className={
                    Number(item.changePercent24Hr) > 0
                      ? styles.tdProsfit
                      : styles.tdLoss
                  }
                  data-label="Mudança 24hr"
                >
                  <span>{Number(item.changePercent24Hr).toFixed(2)}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button
        className={styles.buttonMore}
        onClick={handleGetMore}
        disabled={loading}
      >
        {loading ? (
          <OrbitProgress
            color="#fff"
            size="small"
            style={{ fontSize: "4px" }}
          />
        ) : (
          "Carregar Mais"
        )}
      </button>
    </main>
  );
}
