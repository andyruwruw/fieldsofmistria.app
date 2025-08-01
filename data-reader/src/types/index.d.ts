export interface TableSelectionOptions {
  verticalHeaders?: boolean;

  mainHeader?: string;

  headers?: string[];

  selectHeaders?: boolean[];

  split?: string;
}

export type ParsedElementType = 'text' | 'link' | 'image';

/**
 * Represents a parsed element from the HTML page.
 */
export interface ParsedElement {
  /**
   * The type of the parsed element.
   */
  type: ParsedElementType;

  /**
   * The value of the parsed element.
   */
  value: string | string[];

  /**
   * The attributes of the parsed element.
   */
  attributes?: Record<string, string>;

  /**
   * The children of the parsed element.
   */
  children?: ParsedElement[];
}