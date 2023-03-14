const fs = require("fs");
const util = require("util");

/**
 * We want to use async/await with fs.readFile - util.promisfy gives us that
 */
const readFile = util.promisify(fs.readFile);

/**
 * Logic for fetching Category information
 */
class CategoryService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSOn file that contains the speakers data
   */
  constructor(datafile) {
    this.datafile = datafile;
  }

  /**
   * Returns a list of Categories name and short name
   */
  async getNames() {
    const data = await this.getData();

    // We are using map() to transform the array we get into another one
    return data.map(category => ({name: category.name,
        shortname: category.shortname}));
      
      
  }

  /**
   * Get all Category Data
   */
  async getAllSubCategories() {
    const data = await this.getData();

    // Array.reduce() is used to traverse all Categories and
    // create an array that contains all subcategories
    const subcategories = data.reduce((acc, elm) => {
      if (elm.subcategories) {
        // eslint-disable-next-line no-param-reassign
        acc = [...acc, ...elm.subcategories];
      }
      return acc;
    }, []);
    return subcategories;
  }

  /**
   * Get all subcategories of a given category
   * @param {*} name The category  name
   */
  async getSubCategoriesForCategory(name) {
    const data = await this.getData();
    const category = data.find(elm => elm.name === name);
    if (!category || !category.artwork) return null;
    return category.subcategories;
  }

  /**
   * Get Category information provided a name
   * @param {*} name
   */
  async getSpeaker(name) {
    const data = await this.getData();
    const category = data.find(elm => elm.name === name);
    if (!category) return null;
    return {
      name: category.name,
      summary: category.summary
    };
  }

  /**
   * Returns a list of Categories with only the basic information
   */
  async getListShort() {
    const data = await this.getData();
    return data.map(category => ({
        name: category.name,
        summary: category.summary,
      }));
  }

  /**
   * Get a list of Categories
   */
  async getList() {
    const data = await this.getData();
    return data.map(category => ({
        name: category.name,
        summary: category.summary
      }));
  }

  /**
   * Fetches speakers data from the JSON file provided to the constructor
   */
  async getData() {
    const data = await readFile(this.datafile, "utf8");
    return JSON.parse(data).speakers;
  }
}

module.exports = CategoryService;
