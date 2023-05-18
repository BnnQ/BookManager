import {createContext} from "react";
import LocalApiBookRepository from "../services/localApiBookRepository";

export const DependencyContext = createContext();

export function DependencyProvider(props) {
    const dependencies = {
      bookRepository: new LocalApiBookRepository()  
    };
    
    return (
        <DependencyContext.Provider value={dependencies}>
            {props.children}
        </DependencyContext.Provider>
    )
}