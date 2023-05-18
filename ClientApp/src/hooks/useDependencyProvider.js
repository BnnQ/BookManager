import {useContext} from "react";
import {DependencyContext} from "../components/DependencyProvider";

export default function useDependencyProvider() {
    return useContext(DependencyContext);
}