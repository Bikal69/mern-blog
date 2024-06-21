import { createContext,useContext } from "react"
export const AuthenticationContext=createContext({
    checkAuthentication:async()=>{

      }
})
export const AuthenticationProvider=AuthenticationContext.Provider;

export default function useAuthentication(){
return useContext(AuthenticationContext);
}