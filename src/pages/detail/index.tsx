import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../../service/api";
import { CoinProps } from "../home";
import styles  from './detail.module.css'

interface ResponseData {
  data: CoinProps;
}
interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

export function Detail() {
  const { cripto } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<CoinProps>()
  const [loading, setloading] = useState(true)

  useEffect(() => {
    async function getCoin() {
      try {
        const response = await api.get<DataProps>(`/assets/${cripto}`);
        

        if("error" in response){
            navigate('/')
            return
        }
        const coinData = (response.data as ResponseData).data;

        const price = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          });
          const priceCompact = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
          });

          
          
           const formated = {
             ...coinData,
             formatedPrice: price.format(Number(coinData.priceUsd)),
             formatedMarket: priceCompact.format(Number(coinData.marketCapUsd)),
             formatedVolume: priceCompact.format(Number(coinData.volumeUsd24Hr)),
           };

           setCoin(formated)
           setloading(false)


      } catch (err) {
        console.log(err);
        navigate("/");
      }
    }
    getCoin();
  }, [cripto]);

  if(loading || !coin){
    return(
        <div className={styles.container}>
            <h1 className={styles.center}>Carregando detalhes</h1>
        </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{coin?.name}</h1>
      <h1 className={styles.center}>{coin?.symbol}</h1>

      <section className={styles.content}>
        <img src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`} alt="logo moeda"  className={styles.logo}/>

        
        <p><strong>Preço: </strong>{coin?.formatedPrice}</p>

        <a >
            <strong>Mercado: </strong>{coin?.formatedMarket}
        </a>
        <a>
            <strong>Volume: </strong>{coin?.formatedVolume}
        </a>
        <a>
            <strong>Mudança 24hr: </strong><span className={Number(coin?.changePercent24Hr) > 0 ? styles.prosfit : styles.loss }>{Number(coin?.changePercent24Hr).toFixed(2)}</span>
        </a>
        

      </section>
    </div>
  );
}
