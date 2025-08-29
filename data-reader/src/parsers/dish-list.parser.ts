// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

/**
 * Parses the main dish list page to extract dishes.
 */
export class DishListParser extends Parser<string[]> {
  /**
   * Stores the categories of dishes.
   */
  static DishCategories: Record<string, any> = {};

  /**
   * Stores the sub-categories of dishes.
   */
  static DishSubCategories: Record<string, any> = {};

  /**
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<string[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<string[]> {
    const mainChildren = this._getChildren('div.mw-content-ltr');
    let recipesChildren = null;

    for (let i = 0; i < mainChildren.length; i += 1) {
      if (mainChildren[i].type === 'tag'
        && mainChildren[i].name === 'div'
        && mainChildren[i].attribs.class === 'mw-collapsible') {
        recipesChildren = mainChildren[i].children.filter((child: any) => (child.type === 'tag' && child.name === 'div'))[0].children;
        break;
      }
    }

    if (!recipesChildren) {
      return [];
    }

    const dishUrls = [];

    for (let i = 0; i < recipesChildren.length; i += 1) {
      if (recipesChildren[i].type === 'tag' && recipesChildren[i].name === 'div') {
        const data = this._parseNestedContent(recipesChildren[i]);

        let categoryId = '';

        const stack = [ data ];

        while (stack.length) {
          const curr = stack.pop();

          if (curr instanceof Array) {
            for (let i = 0; i < curr.length; i += 1) {
              const item = curr[i];

              if (item.tag === 'h3') {
                categoryId = item.content.text.toLowerCase().replace(/[\s_]+/g, '-');

                if (!(categoryId in DishListParser.DishCategories)) {
                  DishListParser.DishCategories[categoryId] = {
                    name: item.content.text,
                    id: categoryId,
                    icon: item.content.src,
                  };
                }
              } else if (item.tag === 'h4') {
                const id = item.content.text.toLowerCase().replace(/[\s_\.]+/g, '-');
                
                if (!(id in DishListParser.DishSubCategories)) {
                  DishListParser.DishSubCategories[id] = {
                    name: item.content.text,
                    id,
                    icon: item.content.src,
                    category: categoryId,
                  };
                }
              } else if (item.tag === 'div') {
                stack.push(item.content);
              } else if (item.tag === 'table') {
                for (let i = 0; i < item.content.body.length; i += 1) {
                  const row = item.content.body[i];

                  for (let j = 1; j < 2; j += 1) {
                    const cell = row[j];

                    if (this._isNameTd(cell)) {
                      dishUrls.push(`${BASE_URL}${cell.children[0].attributes.href}`);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return dishUrls;
  }

  /**
   * Checks if the given table cell is an image cell.
   *
   * @param {any} cell The table cell to check.
   * @returns {boolean} True if the cell is an image cell, false otherwise.
   */
  _isImageTd(cell: any): boolean {
    return cell.type === 'td'
      && cell.value === ''
      && cell.children.length === 2
      && cell.children[0].type === 'a'
      && cell.children[0].attributes.class === 'image'
      && cell.children[1].type === 'br'
      && cell.children[0].children[0].type === 'img';
  }

  /**
   * Checks if the given table cell is an image cell.
   *
   * @param {any} cell The table cell to check.
   * @returns {boolean} True if the cell is an image cell, false otherwise.
   */
  _isNameTd(cell: any): boolean {
    return cell.type === 'td'
      && cell.value === ''
      && cell.children.length === 2
      && cell.children[0].type === 'a'
      && cell.children[0].attributes.title
      && cell.children[1].type === 'br'
      && cell.children[0].children[0].type === 'text';
  }
}
