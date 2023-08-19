import { PathLike } from "fs";

export interface ConfigurationParser {
    parse( pathLike: PathLike ): object | Promise<object>;
}