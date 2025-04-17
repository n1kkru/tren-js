/**
 * Элемент для инициализации TomSelect: селектор или сам select-элемент
 */
export type TTomSelectElement = string | HTMLSelectElement;

/**
 * Опция для TomSelect
 */
export interface TTomSelectOption {
  /** значение опции */
  value: string;
  /** отображаемая метка */
  label: string;
  /** дополнительные поля */
  [key: string]: any;
}

/**
 * Экземпляр TomSelect с нужными методами
 */
export interface ITomSelectInstance {
  destroy(): void;
  getValue(): string | string[];
  setValue(value: string | string[], silent?: boolean): this;
  clear(silent?: boolean): this;
  clearOptions(): this;
  refreshOptions(triggerDropdown?: boolean): this;

  addOption(data: TTomSelectOption, user_created?: boolean): string | false;
  removeOption(value: string, silent?: boolean): this;
  getOption(value: string | number, create?: boolean): HTMLElement | null;
  addItem(value: string, silent?: boolean): void;
  removeItem(item?: string | TTomSelectOption, silent?: boolean): void;

  lock(): this;
  unlock(): this;
  enable(): this;
  disable(): this;
}

/**
 * Частичный рекурсивный тип для настроек
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

/**
 * Конфигурация для инициализации TomSelect
 */
export interface ITomSelectConfig extends RecursivePartial<{
  valueField?: string;
  labelField?: string;
  searchField?: string[];
  allowEmptyOption?: boolean;
  hidePlaceholder?: boolean;
  placeholder?: string;
  maxItems?: number | null;
  onInitialize?: () => void;
  onItemAdd?: (value: string | number, item: HTMLDivElement) => void;
  [key: string]: any;
}> {
  placeholder?: string;
  onInitialize?: () => void;
  onItemAdd?: (value: string | number, item: HTMLDivElement) => void;
}
