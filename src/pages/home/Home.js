import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { useAccount} from "wagmi";
import Web3 from "web3";
import {
cont_abi,cont_add
} from "../../components/config";
import { useNetwork, useSwitchNetwork } from "wagmi";
import {
  useContractReads,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
const Home = () => {

    const [quantity, set_quantity] = useState("");
    const [presaleTime, set_presaleTime] = useState(0);

    const increment = () => {
      set_quantity(Number(quantity) + 1);
      find_totalAmount()
    };
    const decrement = () => {
      if (Number(quantity) > 1) {
        set_quantity(Number(quantity) - 1);
        find_totalAmount()

      }
    };



    const targetTime = new Date("2035-01-01").getTime();

    const [currentTime, setCurrentTime] = useState(Date.now());

    const timeBetween = (Number(presaleTime)*1000) - currentTime;
    const seconds = Math.floor((timeBetween / 1000) % 60);
    const minutes = Math.floor((timeBetween / 1000 / 60) % 60);
    const hours = Math.floor((timeBetween / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeBetween / (1000 * 60 * 60 * 24));
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
  
      return () => clearInterval(interval);
    }, []);

    const networkId = 80001;




    const [totalCount, setTotalCount] = useState(0);
    const { address, isConnected } = useAccount();
    const [presaleCost, set_presaleCost] = useState(0);

    const [supply, set_supply] = useState(0);
    const [cost, set_cost] = useState(0);
    const [ref_percentage, set_ref_percentage] = useState(0);
    const [total_price, set_total_price] = useState(0); 
    const [maxSupply, set_maxSupply] = useState(0);
    const [balance, set_balance] = useState(0);
    const [curr_time, set_curr_time] = useState("");
    const [curr_price, set_curr_price] = useState("");
    const [paused, set_paused] = useState("");

  
    const [ref, set_ref] = useState("0x0000000000000000000000000000000000000000");
  
  
  
  
    const { chain } = useNetwork();
  
  
  
    const {
      data: stakeResult,
      isLoading: isLoading_stake,
      isSuccess: stakeSuccess,
      write: mint,
    } = useContractWrite({
      address: cont_add,
      abi: cont_abi,
      functionName: "mint",
      args: [address,quantity],
      value: (Number(quantity)* Number(curr_price)).toString(),
      onSuccess(data) {
        test();
        console.log("Success", data);
      },
    });
  
  
  
  
    
    async function mintNft() {
      console.log("object mint "+ref);

      // if(paused)
      // {
      //   alert("minting is not launched yet")
      //   return
      // }
      if(!isConnected)
      {
        alert("kindly connect your wallet");
        return;
      }
      if(Number(quantity) == 0 || quantity == "")
      {
        alert("kindly write the amount");
        return
      }
      if((Number(curr_price) * Number(quantity)) > Number(balance) )
      {
        alert("you dont have enough balance to buy");
        return
      }

  
      if (chain.id != networkId) {
        mint_switch?.();
      } else {
        mint?.();
      }
    }
  
  
    useEffect(()=>{
  
      if(address!=undefined)
 
        test();
  
      
    
    },[address])
  
    function Convert_To_Wei(val) {
      const web3= new Web3(new Web3.providers.HttpProvider("https://polygon-mumbai-bor-rpc.publicnode.com	"));
    
      val = web3.utils.toWei(val.toString(), "ether");
      return val;
    }
  
    async function test() 
    {
  
      const web3= new Web3(new Web3.providers.HttpProvider("https://polygon-mumbai-bor-rpc.publicnode.com	"));
      let balance;
      try{
         balance = await web3.eth.getBalance(address);

      }catch(e){

      }
      const contract = new web3.eth.Contract(cont_abi, cont_add);
      console.log("object1");
      let supply = await contract.methods.totalSupply().call();
      let cost = await contract.methods.cost().call();
      let whitelistCost = await contract.methods.whitelistCost().call();

      let iswhitelister = await contract.methods.whitelisted(address).call();



      set_balance(balance)
      set_supply(supply)
      if(iswhitelister)
      {
        set_curr_price(whitelistCost)

      }
      else{
        set_curr_price(cost)

      }



    }
  function find_totalAmount(){
    set_total_price(Number(quantity)* Number(curr_price/10**18));
  }
  
    const { switchNetwork: mint_switch } = useSwitchNetwork({
      chainId: networkId,
      // throwForSwitchChainNotSupported: true,
      onSuccess() {
        mint?.();
      },
    });
  
  
    const waitForTransaction2 = useWaitForTransaction({
      hash: stakeResult?.hash,
      onSuccess(data) {
        test?.();
        console.log("Success2", data);
      },
    });
  return (
    <div>
        <Navbar/>


        <div className=' mb-12  mt-12 border-white rounded-md  p-5 w-[85%] md:w-[35%] border  mx-auto h-auto' style={{marginTop:70,paddingTop:40, maxWidth:500
         }} >


           <div className=' text-center  ' >
           <h2 className=' text-white text-xl  sm:text-3xl'>Royal Rising NFTs</h2>
           </div>





            <div className=' my-4 flex justify-between items-center border border-white rounded-md p-3'>
                
                <div>
                    <img src={require('../../assets/images/lion.jpg')} height='40px' width="60px" className=' rounded-md'   alt='' />
                </div>

                <div>
                    <h2 className=' text-gray-200 text-sm'>Price Per NFT</h2>
                    <p className=' text-white font-normal'>{curr_price/10**18} MATIC EACH</p>
                </div>

            </div>



            <div className=' my-4 flex justify-between items-center border border-white rounded-md p-3'>

                <div>
                   <h2 className=' text-white'>Total Minted</h2>
                </div>

                <div>
                    <p className=' text-white'>{supply} </p>
                </div>

            </div>


            <div className=' my-4 sm:flex  block justify-between items-center border border-white rounded-md p-3'>
                <div>
                   <h2 className=' text-white  font-normal' onClick={mint}> Mint Amount</h2>
                </div>
                <div>
                    
                    {/* <p className=' text-white'>0 minuted out of 0</p> */}

                    <div className=' flex justify-between  rounded-sm p-1 bg-white gap-1'>
                        <div    onClick={decrement} className=' bg-[#3b19fc] rounded-sm  w-8 flex justify-center items-center h-8'>
                            <span className=' text-white'>-</span>
                        </div>
                    <input  type='number' readOnly placeholder='1' className=' w-20 text-center' value={quantity}  />
                    <div    onClick={increment} className='bg-[#3b19fc] rounded-sm  w-8 flex justify-center items-center h-8'>
                            <span className=' text-white'>+</span>
                        </div>
                    </div>
                </div>
            </div>


            <div className=' my-4 flex justify-between items-center border border-white rounded-md p-3'>
                <div>
                   <h2 className=' text-white font-normal'> Total Amount</h2>
                </div>
                <div>
                    
                    <p className=' text-white'>{(Number(quantity)* Number(curr_price))/10**18} MATIC</p>
                </div>
            </div>

           <div className=' mt-6'>
           <button className='primary-btn  w-full  text-lg' onClick={mintNft}>MINT NFT NOW</button>
           </div>
        </div>
    </div>
  )
}

export default Home