import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm';

export class TypeOrmNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  primaryKeyName(tableOrName: Table | string, columnNames: string[]) {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const columnsSnakeCase = columnNames.join('_');

    return `${table}_${columnsSnakeCase}_pk`;
  }
}
