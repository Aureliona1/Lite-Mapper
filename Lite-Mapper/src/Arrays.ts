// deno-lint-ignore-file no-explicit-any
import { lerp, random, repeat } from "./Functions.ts";
import type { Easing, NumberArrLike } from "./Types.ts";

export class ArrOp<T extends NumberArrLike> {
	/**
	 * Add an array or a number to an array.
	 * @param arr1 The base array.
	 * @param arr2 The array or number to add.
	 */
	static add<T extends NumberArrLike, T2 extends NumberArrLike>(arr1: T, arr2: number | T2): T {
		if (typeof arr2 == "number") {
			return arr1.map(x => x + arr2) as T;
		} else {
			return arr1.map((x, i) => x + arr2[i]) as T;
		}
	}

	/**
	 * Subtract the entries of an array from a base array. Or subtract a single number from the base array.
	 * @param arr1 The base array.
	 * @param arr2 The array or number to subtract from the base array.
	 */
	static subtract<T extends NumberArrLike, T2 extends NumberArrLike>(arr1: T, arr2: number | T2): T {
		if (typeof arr2 == "number") {
			return arr1.map(x => x - arr2) as T;
		} else {
			return arr1.map((x, i) => x - arr2[i]) as T;
		}
	}

	/**
	 * Divide an array by the elements of another array, or by a number.
	 * @param arr1 The base array.
	 * @param arr2 The array or number to divide by.
	 */
	static divide<T extends NumberArrLike, T2 extends NumberArrLike>(arr1: T, arr2: number | T2): T {
		if (typeof arr2 == "number") {
			return arr1.map(x => x / arr2) as T;
		} else {
			return arr1.map((x, i) => x / arr2[i]) as T;
		}
	}

	/**
	 * Multiply an array by the elements of another array, or by a number.
	 * @param arr1 The base array.
	 * @param arr2 The array or number to mulitply by.
	 */
	static multiply<T extends NumberArrLike, T2 extends NumberArrLike>(arr1: T, arr2: number | T2): T {
		if (typeof arr2 == "number") {
			return arr1.map(x => x * arr2) as T;
		} else {
			return arr1.map((x, i) => x * arr2[i]) as T;
		}
	}

	/**
	 * Linearly interpolate from the values of one array to another array, or a number. If you need to lerp from a number to an array, then reverse the time value (1 - 0 instead of  0 - 1).
	 * @param from The array to lerp "from" (i.e., at fraction = 0).
	 * @param to The array or number ot lerp "to" (i.e., at fraction = 1).
	 * @param fraction The fraction of interpolation (0 - 1).
	 * @param ease Optional easing to add to the lerp.
	 */
	static lerp<T extends NumberArrLike, T2 extends NumberArrLike>(from: T, to: number | T2, fraction: number, ease?: Easing): T {
		if (typeof to == "number") {
			return from.map(x => lerp(x, to, fraction, ease)) as T;
		} else {
			return from.map((x, i) => lerp(x, to[i], fraction, ease)) as T;
		}
	}

	/**
	 * Shuffle the elements of an array.
	 * @param arr The array to shuffle.
	 * @param seed The seed for the shuffle (leave blank for random).
	 */
	static shuffle<T extends NumberArrLike>(arr: T, seed: number = Math.random()): T {
		const swap = (a: number, b: number) => {
			[arr[a], arr[b]] = [arr[b], arr[a]];
		};
		repeat(arr.length, i => {
			swap(random(0, arr.length, seed + i * 26436 + 1, 0), random(0, arr.length, seed + i * 2636 + 134, 0));
		});
		return arr;
	}

	/**
	 * Sort an array in ascending order according to each element's numerical value.
	 * @param arr The array to sort.
	 */
	static sortNumericAsc<T extends NumberArrLike>(arr: T): T {
		return arr.sort((a, b) => a - b) as T;
	}

	/**
	 * Sort an array in descending order according to each element's numerical value.
	 * @param arr The array to sort.
	 */
	static sortNumericDsc<T extends NumberArrLike>(arr: T): T {
		return arr.sort((a, b) => b - a) as T;
	}

	/**
	 * Get the total numeric range of the array. i.e., the distance between the greatest and least elements.
	 * @param arr The array.
	 */
	static range(arr: NumberArrLike): number {
		return Math.max(...arr) - Math.min(...arr);
	}

	/**
	 * Get the numeric average (mean) of the array.
	 * @param arr The array to find the mean of.
	 */
	static mean(arr: NumberArrLike): number {
		return [...arr].reduce((a, b) => a + b) / arr.length;
	}

	/**
	 * Get the numeric median of the array.
	 * @param arr The array to find the median of.
	 */
	static median(arr: NumberArrLike): number {
		return arr.toSorted((a, b) => a - b)[Math.floor(arr.length / 2)];
	}

	/**
	 * Get the most common value (mode) in the array.
	 * @param arr The array to find the mode of.
	 */
	static mode(arr: NumberArrLike): number {
		const out: NumberArrLike[] = [];
		const set = [...new Set(arr)];
		repeat(set.length, i => {
			let instances = 0;
			repeat(arr.length, j => {
				if (set[i] == arr[j]) {
					instances++;
				}
			});
			out.push([set[i], instances]);
		});
		out.sort((a, b) => a[1] - b[1]);
		return out[out.length - 1][0];
	}

	/**
	 * Get the sum of all the elements in the array.
	 */
	static sum(arr: NumberArrLike): number {
		return Array.from(arr).reduce((a, b) => a + b);
	}

	/**
	 * Get the product of all the elements in the array.
	 */
	static product(arr: NumberArrLike): number {
		return Array.from(arr).reduce((a, b) => a * b);
	}

	constructor(public arr: T) {}

	/**
	 * Get the element with the greatest numerical value.
	 */
	get max(): number {
		return Math.max(...this.arr);
	}

	/**
	 * Clamp the maximum value in the array to this value.
	 */
	set max(x: number) {
		this.arr.forEach(a => {
			a = a > x ? x : a;
		});
	}

	/**
	 * Clamp the minimum value in the array to this value.
	 */
	set min(x: number) {
		this.arr.forEach(a => {
			a = a < x ? x : a;
		});
	}

	/**
	 * Get the element in the array with the least numerical value.
	 */
	get min(): number {
		return Math.min(...this.arr);
	}

	/**
	 * Get the numerical distance between the least and greatest element in the array.
	 */
	get range(): number {
		return this.max - this.min;
	}

	/**
	 * Get the average (mean) of the values in the array.
	 */
	get mean(): number {
		return Array.from(this.arr).reduce((a, b) => a + b) / this.arr.length;
	}

	/**
	 * Get the median value of the array.
	 */
	get median(): number {
		return this.arr.toSorted((a, b) => a - b)[Math.floor(this.arr.length / 2)];
	}

	/**
	 * Get the most common value (mode) of the array.
	 */
	get mode(): number {
		const arr: NumberArrLike[] = [];
		const set = [...new Set(this.arr)];
		repeat(set.length, i => {
			let instances = 0;
			repeat(this.arr.length, j => {
				if (set[i] == this.arr[j]) {
					instances++;
				}
			});
			arr.push([set[i], instances]);
		});
		arr.sort((a, b) => a[1] - b[1]);
		return arr[arr.length - 1][0];
	}

	/**
	 * Get the product of all the elements of the array.
	 */
	get product(): number {
		return Array.from(this.arr).reduce((a, b) => a * b);
	}

	/**
	 * Get the sum of all the elements of the array.
	 */
	get sum(): number {
		return Array.from(this.arr).reduce((a, b) => a + b);
	}
}

/**
 * Remove entries from an array and return the modified array. This mutates the original array, therefore you do not need to reassign.
 * @param arr The array to remove elements from.
 * @param indexes The indexes of the elements to remove.
 */
export function arrRem(arr: any[], indexes: number[]): any[] {
	for (let i = indexes.length - 1; i >= 0; i--) {
		arr.splice(indexes[i], 1);
	}
	return arr;
}

/**
 * Create a new array from a function of x. e.g arrFromFunction(10, x => x * 2)
 * @param length The length of the array.
 * @param func The function to run through the array.
 */
export const arrFromFunction = <T>(length: number, func: (x: number) => T): T[] => new Array(length).fill(0).map((_, i) => func(i));
