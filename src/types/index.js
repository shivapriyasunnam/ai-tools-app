// Type definitions for the app
// In JavaScript, we use JSDoc for type documentation

/**
 * @typedef {Object} AiTool
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 * @property {string} route
 * @property {string} color
 */

/**
 * @typedef {Object} ExpenseItem
 * @property {string} id
 * @property {number} amount
 * @property {string} category
 * @property {string} description
 * @property {Date} date
 * @property {string[]} [tags]
 */

/**
 * @typedef {Object} Budget
 * @property {string} id
 * @property {string} category
 * @property {number} limit
 * @property {number} spent
 * @property {'monthly' | 'weekly' | 'yearly'} period
 */

/**
 * @typedef {Object} Meeting
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {Date} startTime
 * @property {Date} endTime
 * @property {string[]} [attendees]
 * @property {string} [location]
 */

/**
 * @typedef {Object} AppContextType
 * @property {boolean} isDarkMode
 * @property {(isDark: boolean) => void} setIsDarkMode
 * @property {{name: string, email: string}} [user]
 */
