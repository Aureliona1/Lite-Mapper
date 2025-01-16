import { lerp, random, repeat } from "./Functions.ts";
import { Easing, NumberArrLike } from "./Types.ts";

export class ArrOp<T extends NumberArrLike> {
	/**
	 * Add an array or a number to an array.
	 * @param arr1 The base array.
	 * @param arr2 The array or number to add.
	 */
	static add<T extends NumberArrLike, T2 extends NumberArrLike>(arr1: T, arr2: number | T2) {
		if (typeof arr2 == "number") {
			arr1 = arr1.map(x => x + arr2) as T;
		} else {
			arr1 = arr1.map((x, i) => x + arr2[i]) as T;
		}
		return arr1;
	}

	/**
	 * Subtract the entries of an array from a base array. Or subtract a single number form the base array.
	 * @param arr1 The base array.
	 * @param arr2 The array or number to subtract from the base array.
	 */
	static subtract<T extends NumberArrLike, T2 extends NumberArrLike>(arr1: T, arr2: number | T2) {
		if (typeof arr2 == "number") {
			arr1 = arr1.map(x => x - arr2) as T;
		} else {
			arr1 = arr1.map((x, i) => x - arr2[i]) as T;
		}
		return arr1;
	}

	/**
	 * Divide an array by the elements of another array, or by a number.
	 * @param arr1 The base array.
	 * @param arr2 The array or number to divide by.
	 */
	static divide<T extends NumberArrLike, T2 extends NumberArrLike>(arr1: T, arr2: number | T2) {
		if (typeof arr2 == "number") {
			arr1 = arr1.map(x => x / arr2) as T;
		} else {
			arr1 = arr1.map((x, i) => x / arr2[i]) as T;
		}
		return arr1;
	}

	/**
	 * Multiply an array by the elements of another array, or by a number.
	 * @param arr1 The base array.
	 * @param arr2 The array or number to mulitply by.
	 */
	static multiply<T extends NumberArrLike, T2 extends NumberArrLike>(arr1: T, arr2: number | T2) {
		if (typeof arr2 == "number") {
			arr1 = arr1.map(x => x * arr2) as T;
		} else {
			arr1 = arr1.map((x, i) => x * arr2[i]) as T;
		}
		return arr1;
	}

	/**
	 * Linearly interpolate from the values of one array to another array, or a number. If you need to lerp from a number to an array, then reverse the time value (1 - 0 instead of  0 - 1).
	 * @param from The array to lerp "from" (i.e., at fraction = 0).
	 * @param to The array or number ot lerp "to" (i.e., at fraction = 1).
	 * @param fraction The fraction of interpolation (0 - 1).
	 * @param ease Optional easing to add to the lerp.
	 */
	static lerp<T extends NumberArrLike, T2 extends NumberArrLike>(from: T, to: number | T2, fraction: number, ease?: Easing) {
		if (typeof to == "number") {
			from = from.map(x => lerp(x, to, fraction, ease)) as T;
		} else {
			from = from.map((x, i) => lerp(x, to[i], fraction, ease)) as T;
		}
		return from;
	}

	/**
	 * Shuffle the elements of an array.
	 * @param arr The array to shuffle.
	 * @param seed The seed for the shuffle (leave blank for random).
	 */
	static shuffle<T extends NumberArrLike>(arr: T, seed = Math.random()) {
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
	static sortNumeric<T extends NumberArrLike>(arr: T) {
		return arr.sort((a, b) => a - b);
	}

	constructor(public arr: T) {}

	get max() {
		return Math.max(...this.arr);
	}

	set max(x) {
		this.arr.forEach(a => {
			a = a > x ? x : a;
		});
	}

	set min(x) {
		this.arr.forEach(a => {
			a = a < x ? x : a;
		});
	}

	get min() {
		return Math.min(...this.arr);
	}

	get range() {
		return this.max - this.min;
	}

	get mean() {
		let out = 0;
		repeat(this.arr.length, i => {
			out += this.arr[i];
		});
		return out / this.arr.length;
	}

	get median() {
		return this.arr.sort((a, b) => a - b)[Math.floor(this.arr.length / 2)];
	}

	get mode() {
		let arr: NumberArrLike[] = [];
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
		arr = arr.sort((a, b) => a[1] - b[1]);
		return arr[arr.length - 1][0];
	}

	/**
	 * Get the product of all the elements of the array.
	 */
	get product() {
		return Array.from(this.arr).reduce((a, b) => a * b);
	}

	/**
	 * Get the sum of all the elements of the array.
	 */
	get sum() {
		return Array.from(this.arr).reduce((a, b) => a + b);
	}
}
