import logo from './logo.svg';
import { useState } from 'react';
import './App.css';
import axios from 'axios'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { TextField,Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
function App() {
  const numberAPI=axios.create({
    baseURL:"http://localhost:8000"
  })
  const [num,setNumber]=useState(0)
  const [lastUserInputNumber,setLastUserInputNumber]=useState(0)
  const [result,setResult]=useState(-1)
  const [timeTakenToCalculate,setTimeTakenToCalculate]=useState(-1)
  const [previousResults,setPreviousResults]=useState([])
  const [isResultInvalid,setIsResultInvalid]=useState(false)
  const isOnProductionMode=true
  const backendURL= isOnProductionMode? "https://bck-bridge.vercel.app/" : "http://localhost:8000/"
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      overflow={"vertical"}
    >
      <Stack direction='column' spacing={3} >
        <p style={{fontSize:30}}>Desafio Bridge</p>

        <Stack direction='row' spacing={2} >
          <TextField type='number' label='NUMERO' value={num} onChange={e=>{
            if (Number.isInteger(Number(e.target.value))) {
              setNumber(e.target.value)
              setIsResultInvalid(false)
            }else{
            setIsResultInvalid(true)
            }
            }} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}/>
          <Button type='button' variant='contained' onClick={
            ()=>{
              axios.get(backendURL+num).then(res=>{
              if(res.data.numbers >= 0){
                setResult(res.data.numbers)
                setTimeTakenToCalculate(res.data.time)
                setPreviousResults([...previousResults,{userNumber:num,result:res.data.numbers}])
                setLastUserInputNumber(num)
                setIsResultInvalid(false)
              }else{
                  setIsResultInvalid(true)
              }
            }).catch(err=>console.log(err))
            }
          }>CALCULAR</Button>
          <Button type='button' variant='outlined' onClick={()=>{
            setNumber(0)
            setTimeTakenToCalculate(-1)
            setResult(-1)
            setPreviousResults([])
          }}>RESETAR</Button>
        </Stack>
        { result >= 0 && <p style={{fontSize:20}}>Número De  Primos Até {lastUserInputNumber} : {result}</p>}
        {isResultInvalid && <p style={{color:"red"}}>ENTRADA INVÁLIDA : APENAS INTEIROS MAIORES QUE 1</p>}
        {timeTakenToCalculate > -1 && <p style={{fontSize:20}}>Tempo para o cálculo ser realizado : {timeTakenToCalculate} ms</p>}
        {previousResults.length > 0 && <p style={{fontSize:20}}>Lista de Resultados Prévios</p>}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 150 }} aria-label="simple table"> {/*650*/}
              <TableHead>
                <TableRow>
                  <TableCell>User Input</TableCell>
                  <TableCell align="right">Output</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previousResults.map((row) => (
                  <TableRow
                    key={row.userNumber}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.userNumber}
                    </TableCell>
                    <TableCell align="right">{row.result}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
      </TableContainer>
      </Stack>
    </Box>
  
  );
}

export default App;
