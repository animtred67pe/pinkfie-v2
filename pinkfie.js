/*!
 * Pinkfie - The Flash Player emulator in Javascript
 * 
 * v2.1.4 (2024-12-8)
 * 
 * Made in Peru
 * 
 * (c) 2024 ATFSMedia Productions.
 */

var PinkFie = (function() {
	const multiplicationMatrix = function (a, b) {
		return [
			a[0] * b[0] + a[2] * b[1],
			a[1] * b[0] + a[3] * b[1],
			a[0] * b[2] + a[2] * b[3],
			a[1] * b[2] + a[3] * b[3],
			a[0] * b[4] + a[2] * b[5] + a[4],
			a[1] * b[4] + a[3] * b[5] + a[5],
		];
	};
	const multiplicationColor = function (a, b) {
		return [
			a[0] * b[0],
			a[1] * b[1],
			a[2] * b[2],
			a[3] * b[3],
			a[0] * b[4] + a[4],
			a[1] * b[5] + a[5],
			a[2] * b[6] + a[6],
			a[3] * b[7] + a[7],
		];
	};
	const generateColorTransform = function (color, data) {
		return [
			Math.max(0, Math.min(color[0] * data[0] + data[4], 255)) | 0,
			Math.max(0, Math.min(color[1] * data[1] + data[5], 255)) | 0,
			Math.max(0, Math.min(color[2] * data[2] + data[6], 255)) | 0,
			Math.max(0, Math.min(color[3] * 255 * data[3] + data[7], 255)) / 255,
		];
	};
	const generateMatrix = function (point, data) {
		return [
			point[0] * data[0] + point[1] * data[2] + data[4],
			point[0] * data[1] + point[1] * data[3] + data[5],
		];
	};
	const boundsMatrix = function (bounds, matrix) {
		var no = Number.MAX_VALUE;
		var xMax = -no;
		var yMax = -no;
		var xMin = no;
		var yMin = no;
		var _xMin = bounds.xMin;
		var _xMax = bounds.xMax;
		var _yMin = bounds.yMin;
		var _yMax = bounds.yMax;
		var x0 = _xMax * matrix[0] + _yMax * matrix[2] + matrix[4];
		var x1 = _xMax * matrix[0] + _yMin * matrix[2] + matrix[4];
		var x2 = _xMin * matrix[0] + _yMax * matrix[2] + matrix[4];
		var x3 = _xMin * matrix[0] + _yMin * matrix[2] + matrix[4];
		var y0 = _xMax * matrix[1] + _yMax * matrix[3] + matrix[5];
		var y1 = _xMax * matrix[1] + _yMin * matrix[3] + matrix[5];
		var y2 = _xMin * matrix[1] + _yMax * matrix[3] + matrix[5];
		var y3 = _xMin * matrix[1] + _yMin * matrix[3] + matrix[5];
		return {
			xMin: Math.min(Math.min(Math.min(Math.min(xMin, x0), x1), x2), x3),
			xMax: Math.max(Math.max(Math.max(Math.max(xMax, x0), x1), x2), x3),
			yMin: Math.min(Math.min(Math.min(Math.min(yMin, y0), y1), y2), y3),
			yMax: Math.max(Math.max(Math.max(Math.max(yMax, y0), y1), y2), y3),
		};
	};

	const ByteInput = function (arrayBuffer, start = 0, end = arrayBuffer.byteLength) {
		this.arrayBuffer = arrayBuffer;
		this.dataView = new DataView(arrayBuffer);
		this.start = start;
		this.end = end;
		this.bit_offset = 0;
		this._position = start;
		this.littleEndian = true;
	};
	Object.defineProperties(ByteInput.prototype, {
		position: {
			get: function () {
				return this._position - this.start;
			},
			set: function (value) {
				this._position = value + this.start;
			},
		},
		length: {
			get: function () {
				return this.end - this.start;
			},
		},
		bytesAvailable: {
			get: function () {
				return this.end - this._position;
			},
		},
	});
	ByteInput.prototype.extract = function (length) {
		return new ByteInput(
			this.arrayBuffer,
			this._position,
			this._position + length
		);
	};
	ByteInput.prototype.from = function (start, end) {
		return new ByteInput(
			this.arrayBuffer,
			this.start + start,
			this.start + end
		);
	};
	ByteInput.prototype.readString = function (length) {
		var str = "";
		var count = length;
		while (count) {
			var code = this.dataView.getUint8(this._position++);
			str += String.fromCharCode(code);
			count--;
		}
		return str;
	};
	ByteInput.prototype.readBytes = function (length) {
		this.byteAlign();
		var bytes = this.arrayBuffer.slice(this._position, this._position + length);
		this._position += length;
		return bytes;
	};
	ByteInput.prototype.readStringWithUntil = function () {
		this.byteAlign();
		var bo = this._position;
		var offset = 0;
		var length = this.end;
		var ret = "";
		while (true) {
			var val = this.dataView.getUint8(bo + offset);
			offset++;
			if (val === 0 || bo + offset >= length) break;
			ret += String.fromCharCode(val);
		}
		this._position = bo + offset;
		return ret;
	};
	ByteInput.prototype.readStringWithLength = function () {
		var count = this.readUint8();
		var val = "";
		while (count--) {
			var dat = this.dataView.getUint8(this._position++);
			if (dat == 0) continue;
			val += String.fromCharCode(dat);
		}
		return val;
	};
	ByteInput.prototype.incrementOffset = function (byteInt, bitInt) {
		this._position += byteInt;
		this.bit_offset += bitInt;
		this.byteCarry();
	};
	ByteInput.prototype.setOffset = function (byteInt, bitInt) {
		this._position = byteInt + this.start;
		this.bit_offset = bitInt;
	};
	//////// ByteReader ////////
	ByteInput.prototype.byteAlign = function () {
		if (!this.bit_offset) return;
		this._position += ((this.bit_offset + 7) / 8) | 0;
		this.bit_offset = 0;
	};
	ByteInput.prototype.readUint8 = function () {
		this.byteAlign();
		return this.dataView.getUint8(this._position++);
	};
	ByteInput.prototype.readUint16 = function () {
		this.byteAlign();
		var value = this.dataView.getUint16(this._position, this.littleEndian);
		this._position += 2;
		return value;
	};
	ByteInput.prototype.readUint24 = function () {
		this.byteAlign();
		var value = this.dataView.getUint8(this._position++);
		value += 0x100 * this.dataView.getUint8(this._position++);
		value += 0x10000 * this.dataView.getUint8(this._position++);
		return value;
	};
	ByteInput.prototype.readUint32 = function () {
		this.byteAlign();
		var value = this.dataView.getUint32(this._position, this.littleEndian);
		this._position += 4;
		return value;
	};
	ByteInput.prototype.readUint64 = function () {
		this.byteAlign();
		var value = this.readUint32();
		value += Math.pow(2, 32) * this.readUint32();
		return value;
	};
	ByteInput.prototype.readInt8 = function () {
		this.byteAlign();
		return this.dataView.getInt8(this._position++);
	};
	ByteInput.prototype.readInt16 = function () {
		this.byteAlign();
		var value = this.dataView.getInt16(this._position, this.littleEndian);
		this._position += 2;
		return value;
	};
	ByteInput.prototype.readInt24 = function () {
		let t = this.readUint24();
		return t >> 23 && (t -= 16777216), t;
	};
	ByteInput.prototype.readInt32 = function () {
		this.byteAlign();
		var value = this.dataView.getInt32(this._position, this.littleEndian);
		this._position += 4;
		return value;
	};
	ByteInput.prototype.readFixed8 = function () {
		return +(this.readInt16() / 0x100).toFixed(1);
	};
	ByteInput.prototype.readFixed16 = function () {
		return +(this.readInt32() / 0x10000).toFixed(2);
	};
	ByteInput.prototype.readFloat16 = function () {
		const t = this.dataView.getUint8(this._position++);
		let e = 0;
		return (
			(e |= this.dataView.getUint8(this._position++) << 8), (e |= t << 0), e
		);
	};
	ByteInput.prototype.readFloat32 = function () {
		var t = this.dataView.getUint8(this._position++);
		var e = this.dataView.getUint8(this._position++);
		var s = this.dataView.getUint8(this._position++);
		var a = 0;
		(a |= this.dataView.getUint8(this._position++) << 24),
			(a |= s << 16),
			(a |= e << 8),
			(a |= t << 0);
		const i = (a >> 23) & 255;
		return a && 2147483648 !== a
			? (2147483648 & a ? -1 : 1) *
					(8388608 | (8388607 & a)) *
					Math.pow(2, i - 127 - 23)
			: 0;
	};
	ByteInput.prototype.readFloat64 = function () {
		var upperBits = this.readUint32();
		var lowerBits = this.readUint32();
		var sign = (upperBits >>> 31) & 0x1;
		var exp = (upperBits >>> 20) & 0x7ff;
		var upperFraction = upperBits & 0xfffff;
		return !upperBits && !lowerBits
			? 0
			: (sign === 0 ? 1 : -1) *
					(upperFraction / 1048576 + lowerBits / 4503599627370496 + 1) *
					Math.pow(2, exp - 1023);
	};
	ByteInput.prototype.readDouble = function () {
		var v = this.dataView.getFloat64(this._position, this.littleEndian);
		this._position += 8;
		return v;
	};
	ByteInput.prototype.readEncodedU32 = function () {
		this.byteAlign();
		let val = 0;
		for (let e = 0; 5 > e; ++e) {
			let byte = this.dataView.getUint8(this._position++);
			val |= (127 & byte) << (7 * e);
			if ((128 & byte) == 0) break;
		}
		return val;
	};
	//////// BitReader ////////
	ByteInput.prototype.byteCarry = function () {
		if (this.bit_offset > 7) {
			this._position += ((this.bit_offset + 7) / 8) | 0;
			this.bit_offset &= 0x07;
		} else {
			while (this.bit_offset < 0) {
				this._position--;
				this.bit_offset += 8;
			}
		}
	};
	ByteInput.prototype.readUB = function (n) {
		var value = 0;
		while (n--) (value <<= 1), (value |= this.readBit());
		return value;
	};
	ByteInput.prototype.readSB = function (n) {
		var uval = this.readUB(n);
		var shift = 32 - n;
		return (uval << shift) >> shift;
	};
	ByteInput.prototype.readBit = function () {
		var val = (this.dataView.getUint8(this._position) >> (7 - this.bit_offset++)) & 0x1;
		return this.byteCarry(), val;
	};
	ByteInput.prototype.readSBFixed8 = function (n) {
		return +(this.readSB(n) / 0x100).toFixed(2);
	};
	ByteInput.prototype.readSBFixed16 = function (n) {
		return +(this.readSB(n) / 0x10000).toFixed(4);
	};

	const ZLib = {
		decompress: function (arrayBuffer, uncompressedSizesize, startOffset) {
			const fixedDistTable = {
					key: [
						5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
						5, 5, 5, 5, 5, 5, 5, 5, 5,
					],
					value: [
						0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
						19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
					],
				},
				fixedLitTable = {
					key: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
					value: [256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 280, 281, 282, 283, 284, 285, 286, 287, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255],
				},
				ORDER = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]),
				LEXT = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 99, 99]),
				LENS = new Uint16Array([3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]),
				DEXT = new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]),
				DISTS = new Uint16Array([1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577]),
				stream = new Uint8Array(arrayBuffer),
				_data = new Uint8Array(uncompressedSizesize);
			var _size = startOffset || 0,
				byte_offset = _size + 2,
				bit_offset = 8,
				bit_buffer = null;
			const readUint16be = function () {
				let a = (stream[byte_offset + 1] << 8) + stream[byte_offset];
				return byte_offset += 2, a;
			};
			const readUB = function (length) {
				let value = 0;
				for (let i = 0; i < length; i++) {
					if (bit_offset === 8) 
						bit_buffer = stream[byte_offset++],
						bit_offset = 0;
					value |= (bit_buffer & (1 << bit_offset++) ? 1 : 0) << i;
				}
				return value;
			};
			const buildHuffTable = function (data) {
				const length = data.length;
				const blCount = [];
				const nextCode = [];
				let maxBits = 0;
				let i = length;
				let len = 0;
				while (i--) 
					len = data[i],
					maxBits = Math.max(maxBits, len),
					blCount[len] = (blCount[len] || 0) + (len > 0);
				let code = 0;
				for (i = 0; i < maxBits; i++) {
					len = i;
					if (!(len in blCount))
						blCount[len] = 0;
					code = (code + blCount[len]) << 1;
					nextCode[i + 1] = code | 0;
				}
				const key = [];
				const value = [];
				for (i = 0; i < length; i++) {
					len = data[i];
					if (len) {
						const tt = nextCode[len];
						key[tt] = len;
						value[tt] = i;
						nextCode[len] = (tt + 1) | 0;
					}
				}
				return { key, value };
			};
			const decodeSymbol = function (key, value) {
				let len = 0;
				let code = 0;
				while (true) {
					code = (code << 1) | readUB(1);
					len++;
					if (!(code in key)) continue;
					if (key[code] === len) return value[code];
				}
			};
			var sym = 0, i = 0, length = 0, flag = 0;
			const codeLengths = new Uint8Array(19);
			while (!flag) {
				flag = readUB(1);
				let type = readUB(2);
				let distTable = null;
				let litTable = null;
				switch (type) {
					case 0:
						bit_offset = 8;
						bit_buffer = null;
						length = readUint16be();
						byte_offset += 2;
						_data.set(stream.subarray(byte_offset, byte_offset + length), _size);
						byte_offset += length;
						_size += length;
						break;
					default:
						switch (type) {
							case 1:
								distTable = fixedDistTable;
								litTable = fixedLitTable;
								break;
							default:
								const numLitLengths = readUB(5) + 257;
								const numDistLengths = readUB(5) + 1;
								const numCodeLengths = readUB(4) + 4;
								for (i = 0; i < numCodeLengths; i++) 
									codeLengths[ORDER[i]] = readUB(3);
								const codeTable = buildHuffTable(codeLengths);
								codeLengths.fill(0);
								var prevCodeLen = 0;
								const maxLengths = numLitLengths + numDistLengths;
								const litLengths = new Uint8Array(maxLengths);
								let litLengthSize = 0;
								while (litLengthSize < maxLengths) {
									sym = decodeSymbol(codeTable.key, codeTable.value);
									switch (sym) {
										case 0:
										case 1:
										case 2:
										case 3:
										case 4:
										case 5:
										case 6:
										case 7:
										case 8:
										case 9:
										case 10:
										case 11:
										case 12:
										case 13:
										case 14:
										case 15:
											litLengths[litLengthSize++] = sym;
											prevCodeLen = sym;
											break;
										case 16:
											i = readUB(2) + 3;
											litLengths.fill(
												prevCodeLen,
												litLengthSize,
												litLengthSize + i
											);
											litLengthSize += i;
											break;
										case 17:
											i = readUB(3) + 3;
											litLengthSize += i;
											break;
										case 18:
											i = readUB(7) + 11;
											litLengthSize += i;
											break;
									}
								}
								distTable = buildHuffTable(litLengths.subarray(numLitLengths));
								litTable = buildHuffTable(litLengths.subarray(0, numLitLengths));
						}
						sym = 0;
						while (true) {
							sym = 0 | decodeSymbol(litTable.key, litTable.value);
							if (256 === sym) break;
							if (sym < 256) {
								_data[_size++] = sym;
							} else {
								const mapIdx = (sym - 257) | 0;
								length = (LENS[mapIdx] + readUB(LEXT[mapIdx])) | 0;
								const distMap = decodeSymbol(distTable.key, distTable.value);
								i = (_size - ((DISTS[distMap] + readUB(DEXT[distMap])) | 0)) | 0;
								while (length--) _data[_size++] = _data[i++];
							}
						}
				}
			}
			return _data.buffer;
		},
	};

	/*
	 * LZMA
	 *
	 * credit to swf2js
	 */
	const LZMA = (function () {
		function __init(e) {
			const t = [];
			t.push(e[12], e[13], e[14], e[15], e[16], e[4], e[5], e[6], e[7]);
			let s = 8;
			for (let e = 5; e < 9; ++e) {
				if (t[e] >= s) {
					t[e] = (t[e] - s) | 0;
					break;
				}
				(t[e] = (256 + t[e] - s) | 0), (s = 1);
			}
			return t.push(0, 0, 0, 0), e.set(t, 4), e.subarray(4);
		}
		function __reverseDecode2(e, t, s, i) {
			let r = 1,
				o = 0,
				d = 0;
			for (; d < i; ++d) {
				const i = s.decodeBit(e, t + r);
				(r = (r << 1) | i), (o |= i << d);
			}
			return o;
		}
		function __decompress(e, t) {
			const s = new Decoder(),
				i = s.decodeHeader(e),
				r = i.uncompressedSize;
			if ((s.setProperties(i), !s.decodeBody(e, t, r)))
				throw new Error("Error in lzma data stream");
			return t;
		}
		const OutWindow = function () {
			(this._buffer = null),
				(this._stream = null),
				(this._pos = 0),
				(this._streamPos = 0),
				(this._windowSize = 0);
		};
		OutWindow.prototype.create = function (e) {
			(this._buffer && this._windowSize === e) ||
				(this._buffer = new Uint8Array(e)),
				(this._windowSize = e);
		};
		OutWindow.prototype.flush = function () {
			const e = this._pos - this._streamPos;
			e &&
				(this._stream.writeBytes(this._buffer, e),
				this._pos >= this._windowSize && (this._pos = 0),
				(this._streamPos = this._pos));
		};
		OutWindow.prototype.releaseStream = function () {
			this.flush(), (this._stream = null);
		};
		OutWindow.prototype.setStream = function (e) {
			this._stream = e;
		};
		OutWindow.prototype.init = function (e = !1) {
			e || ((this._streamPos = 0), (this._pos = 0));
		};
		OutWindow.prototype.copyBlock = function (e, t) {
			let s = this._pos - e - 1;
			for (s < 0 && (s += this._windowSize); t--; )
				s >= this._windowSize && (s = 0),
					(this._buffer[this._pos++] = this._buffer[s++]),
					this._pos >= this._windowSize && this.flush();
		};
		OutWindow.prototype.putByte = function (e) {
			(this._buffer[this._pos++] = e),
				this._pos >= this._windowSize && this.flush();
		};
		OutWindow.prototype.getByte = function (e) {
			let t = this._pos - e - 1;
			return t < 0 && (t += this._windowSize), this._buffer[t];
		};
		const RangeDecoder = function () {
			(this._stream = null), (this._code = 0), (this._range = -1);
		};
		RangeDecoder.prototype.setStream = function (e) {
			this._stream = e;
		};
		RangeDecoder.prototype.releaseStream = function () {
			this._stream = null;
		};
		RangeDecoder.prototype.init = function () {
			let e = 5;
			for (this._code = 0, this._range = -1; e--; )
				this._code = (this._code << 8) | this._stream.readByte();
		};
		RangeDecoder.prototype.decodeDirectBits = function (e) {
			let t = 0,
				s = e;
			for (; s--; ) {
				this._range >>>= 1;
				const e = (this._code - this._range) >>> 31;
				(this._code -= this._range & (e - 1)),
					(t = (t << 1) | (1 - e)),
					0 == (4278190080 & this._range) &&
						((this._code = (this._code << 8) | this._stream.readByte()),
						(this._range <<= 8));
			}
			return t;
		};
		RangeDecoder.prototype.decodeBit = function (e, t) {
			const s = e[t],
				i = (this._range >>> 11) * s;
			return (2147483648 ^ this._code) < (2147483648 ^ i)
				? ((this._range = i),
					(e[t] += (2048 - s) >>> 5),
					0 == (4278190080 & this._range) &&
						((this._code = (this._code << 8) | this._stream.readByte()),
						(this._range <<= 8)),
					0)
				: ((this._range -= i),
					(this._code -= i),
					(e[t] -= s >>> 5),
					0 == (4278190080 & this._range) &&
						((this._code = (this._code << 8) | this._stream.readByte()),
						(this._range <<= 8)),
					1);
		};
		const BitTreeDecoder = function (e) {
			(this._models = Array(1 << e).fill(1024)), (this._numBitLevels = e);
		};
		BitTreeDecoder.prototype.decode = function (e) {
			let t = 1,
				s = this._numBitLevels;
			for (; s--; ) t = (t << 1) | e.decodeBit(this._models, t);
			return t - (1 << this._numBitLevels);
		};
		BitTreeDecoder.prototype.reverseDecode = function (e) {
			let t = 1,
				s = 0,
				i = 0;
			for (; i < this._numBitLevels; ++i) {
				const r = e.decodeBit(this._models, t);
				(t = (t << 1) | r), (s |= r << i);
			}
			return s;
		};
		const LenDecoder = function () {
			(this._choice = [1024, 1024]),
				(this._lowCoder = []),
				(this._midCoder = []),
				(this._highCoder = new BitTreeDecoder(8)),
				(this._numPosStates = 0);
		};
		LenDecoder.prototype.create = function (e) {
			for (; this._numPosStates < e; ++this._numPosStates)
				(this._lowCoder[this._numPosStates] = new BitTreeDecoder(3)),
					(this._midCoder[this._numPosStates] = new BitTreeDecoder(3));
		};
		LenDecoder.prototype.decode = function (e, t) {
			return 0 === e.decodeBit(this._choice, 0)
				? this._lowCoder[t].decode(e)
				: 0 === e.decodeBit(this._choice, 1)
				? 8 + this._midCoder[t].decode(e)
				: 16 + this._highCoder.decode(e);
		};
		const Decoder2 = function () {
			this._decoders = Array(768).fill(1024);
		};
		Decoder2.prototype.decodeNormal = function (e) {
			let t = 1;
			do {
				t = (t << 1) | e.decodeBit(this._decoders, t);
			} while (t < 256);
			return 255 & t;
		};
		Decoder2.prototype.decodeWithMatchByte = function (e, t) {
			let s = 1;
			do {
				const i = (t >> 7) & 1;
				t <<= 1;
				const r = e.decodeBit(this._decoders, ((1 + i) << 8) + s);
				if (((s = (s << 1) | r), i !== r)) {
					for (; s < 256; ) s = (s << 1) | e.decodeBit(this._decoders, s);
					break;
				}
			} while (s < 256);
			return 255 & s;
		};
		const LiteralDecoder = function () {};
		LiteralDecoder.prototype.create = function (e, t) {
			if (this._coders && this._numPrevBits === t && this._numPosBits === e)
				return;
			(this._numPosBits = e),
				(this._posMask = (1 << e) - 1),
				(this._numPrevBits = t),
				(this._coders = []);
			let s = 1 << (this._numPrevBits + this._numPosBits);
			for (; s--; ) this._coders[s] = new Decoder2();
		};
		LiteralDecoder.prototype.getDecoder = function (e, t) {
			return this._coders[
				((e & this._posMask) << this._numPrevBits) +
					((255 & t) >>> (8 - this._numPrevBits))
			];
		};
		const Decoder = function () {
			(this._outWindow = new OutWindow()),
				(this._rangeDecoder = new RangeDecoder()),
				(this._isMatchDecoders = Array(192).fill(1024)),
				(this._isRepDecoders = Array(12).fill(1024)),
				(this._isRepG0Decoders = Array(12).fill(1024)),
				(this._isRepG1Decoders = Array(12).fill(1024)),
				(this._isRepG2Decoders = Array(12).fill(1024)),
				(this._isRep0LongDecoders = Array(192).fill(1024)),
				(this._posDecoders = Array(114).fill(1024)),
				(this._posAlignDecoder = new BitTreeDecoder(4)),
				(this._lenDecoder = new LenDecoder()),
				(this._repLenDecoder = new LenDecoder()),
				(this._literalDecoder = new LiteralDecoder()),
				(this._dictionarySize = -1),
				(this._dictionarySizeCheck = -1),
				(this._posSlotDecoder = [
					new BitTreeDecoder(6),
					new BitTreeDecoder(6),
					new BitTreeDecoder(6),
					new BitTreeDecoder(6),
				]);
		};
		Decoder.prototype.setDictionarySize = function (e) {
			return (
				!(e < 0) &&
				(this._dictionarySize !== e &&
					((this._dictionarySize = e),
					(this._dictionarySizeCheck = Math.max(this._dictionarySize, 1)),
					this._outWindow.create(Math.max(this._dictionarySizeCheck, 4096))),
				!0)
			);
		};
		Decoder.prototype.setLcLpPb = function (e, t, s) {
			if (e > 8 || t > 4 || s > 4) return !1;
			const i = 1 << s;
			return (
				this._literalDecoder.create(t, e),
				this._lenDecoder.create(i),
				this._repLenDecoder.create(i),
				(this._posStateMask = i - 1),
				!0
			);
		};
		Decoder.prototype.setProperties = function (e) {
			if (!this.setLcLpPb(e.lc, e.lp, e.pb))
				throw Error("Incorrect stream properties");
			if (!this.setDictionarySize(e.dictionarySize))
				throw Error("Invalid dictionary size");
		};
		Decoder.prototype.decodeHeader = function (e) {
			if (e._$size < 13) return !1;
			let t = e.readByte();
			const s = t % 9;
			t = ~~(t / 9);
			const i = t % 5,
				r = ~~(t / 5);
			let o = e.readByte();
			(o |= e.readByte() << 8),
				(o |= e.readByte() << 16),
				(o += 16777216 * e.readByte());
			let d = e.readByte();
			return (
				(d |= e.readByte() << 8),
				(d |= e.readByte() << 16),
				(d += 16777216 * e.readByte()),
				e.readByte(),
				e.readByte(),
				e.readByte(),
				e.readByte(),
				{ lc: s, lp: i, pb: r, dictionarySize: o, uncompressedSize: d }
			);
		};
		Decoder.prototype.decodeBody = function (e, t, s) {
			let i,
				r,
				o = 0,
				d = 0,
				h = 0,
				c = 0,
				n = 0,
				_ = 0,
				a = 0;
			for (
				this._rangeDecoder.setStream(e),
					this._rangeDecoder.init(),
					this._outWindow.setStream(t),
					this._outWindow.init(!1);
				_ < s;

			) {
				const e = _ & this._posStateMask;
				if (
					0 ===
					this._rangeDecoder.decodeBit(this._isMatchDecoders, (o << 4) + e)
				) {
					const e = this._literalDecoder.getDecoder(_++, a);
					(a =
						o >= 7
							? e.decodeWithMatchByte(
									this._rangeDecoder,
									this._outWindow.getByte(d)
								)
							: e.decodeNormal(this._rangeDecoder)),
						this._outWindow.putByte(a),
						(o = o < 4 ? 0 : o - (o < 10 ? 3 : 6));
				} else {
					if (1 === this._rangeDecoder.decodeBit(this._isRepDecoders, o))
						(i = 0),
							0 === this._rangeDecoder.decodeBit(this._isRepG0Decoders, o)
								? 0 ===
										this._rangeDecoder.decodeBit(
											this._isRep0LongDecoders,
											(o << 4) + e
										) && ((o = o < 7 ? 9 : 11), (i = 1))
								: (0 === this._rangeDecoder.decodeBit(this._isRepG1Decoders, o)
										? (r = h)
										: (0 ===
											this._rangeDecoder.decodeBit(this._isRepG2Decoders, o)
												? (r = c)
												: ((r = n), (n = c)),
											(c = h)),
									(h = d),
									(d = r)),
							0 === i &&
								((i = 2 + this._repLenDecoder.decode(this._rangeDecoder, e)),
								(o = o < 7 ? 8 : 11));
					else {
						(n = c),
							(c = h),
							(h = d),
							(i = 2 + this._lenDecoder.decode(this._rangeDecoder, e)),
							(o = o < 7 ? 7 : 10);
						const t = this._posSlotDecoder[i <= 5 ? i - 2 : 3].decode(
							this._rangeDecoder
						);
						if (t >= 4) {
							const e = (t >> 1) - 1;
							if (((d = (2 | (1 & t)) << e), t < 14))
								d += __reverseDecode2(
									this._posDecoders,
									d - t - 1,
									this._rangeDecoder,
									e
								);
							else if (
								((d += this._rangeDecoder.decodeDirectBits(e - 4) << 4),
								(d += this._posAlignDecoder.reverseDecode(this._rangeDecoder)),
								d < 0)
							) {
								if (-1 === d) break;
								return !1;
							}
						} else d = t;
					}
					if (d >= _ || d >= this._dictionarySizeCheck) return !1;
					this._outWindow.copyBlock(d, i),
						(_ += i),
						(a = this._outWindow.getByte(0));
				}
			}
			return (
				this._outWindow.releaseStream(), this._rangeDecoder.releaseStream(), !0
			);
		};
		const InStream = function (e) {
			this._$data = e;
			this._$size = e.length;
			this._$offset = 0;
		};
		InStream.prototype.readByte = function () {
			return this._$data[this._$offset++];
		};
		const OutStream = function (e) {
			this.size = 8;
			this.buffers = e;
		};
		OutStream.prototype.writeBytes = function (e, t) {
			if (e.length === t) {
				this.buffers.set(e, this.size);
			} else {
				this.buffers.set(e.subarray(0, t), this.size);
			}
			this.size += t;
		};
		return {
			parse: function (data, fileLength) {
				const t = fileLength,
					s = data,
					i = new Uint8Array(t + 8);
				i.set(s.slice(0, 8), 0);
				__decompress(new InStream(__init(s)), new OutStream(i));
				return i;
			},
		};
	})();

	/*
	 * Nellymoser JS
	 *
	 * A pure Javascript for the Nellymoser audio codec.
	 *
	 * credit to JPEXS
	 *
	 * (c) 2024 ATFSMedia Productions.
	 *
	 * Made in Peru
	 */
	const AT_Nellymoser_Decoder = (function() {
		const _1 = function () {
			(this.bytePos = 0), (this.bitPos = 0);
		};
		(_1.prototype.push = function (val, len, buf) {
			if (this.bitPos == 0) buf[this.bytePos] = val;
			else buf[this.bytePos] |= val << this.bitPos;
			this.bitPos += len;
			if (this.bitPos >= 8) {
				this.bytePos++;
				this.bitPos -= 8;
				if (this.bitPos > 0) buf[this.bytePos] = val >> (len - this.bitPos);
			}
		}),
			(_1.prototype.pop = function (a, b) {
				let c = (b[this.bytePos] & 0xff) >> this.bitPos,
					d = 8 - this.bitPos;
				if (a >= d) {
					this.bytePos++;
					if (a > d) c |= b[this.bytePos] << d;
				}
				this.bitPos = (this.bitPos + a) & 7;
				return c & ((1 << a) - 1);
			});
		const _2 = function (a) {
			(this.value = 0), (this.scale = 0);
			if (a == 0) {
				(this.value = a), (this.scale = 31);
				return;
			} else if (a >= 1 << 30) {
				(this.value = 0), (this.scale = 0);
				return;
			}
			let v = a,
				s = 0;
			if (v > 0) {
				do (v <<= 1), ++s;
				while (v < 1 << 30);
			} else {
				let b = 1 << 31;
				do (v <<= 1), ++s;
				while (v > b + (1 << 30));
			}
			(this.value = v), (this.scale = s);
		},
		_o1 = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 21, 24, 28, 32, 37, 43, 49, 56, 64, 73, 83, 95, 109, 124],
		_o2 = [6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		_t0 = [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 8, 9, 10, 12, 14, 15, 0],
		_t1 = [3134, 5342, 6870, 7792, 8569, 9185, 9744, 10191, 10631, 11061, 11434, 11770, 12116, 12513, 12925, 13300, 13674, 14027, 14352, 14716, 15117, 15477, 15824, 16157, 16513, 16804, 17090, 17401, 17679, 17948, 18238, 18520, 18764, 19078, 19381, 19640, 19921, 20205, 20500, 20813, 21162, 21465, 21794, 22137, 22453, 22756, 23067, 23350, 23636, 23926, 24227, 24521, 24819, 25107, 25414, 25730, 26120, 26497, 26895, 27344, 27877, 28463, 29426, 31355],
		_t2 = [-11725, -9420, -7910, -6801, -5948, -5233, -4599, -4039, -3507, -3030, -2596, -2170, -1774, -1383, -1016, -660, -329, -1, 337, 696, 1085, 1512, 1962, 2433, 2968, 3569, 4314, 5279, 6622, 8154, 10076, 12975],
		_t3 = [0, -0.847256005, 0.722470999, -1.52474797, -0.453148007, 0.375360996, 1.47178996, -1.98225796, -1.19293797, -0.582937002, -0.0693780035, 0.390956998, 0.906920016, 1.486274, 2.22154093, -2.38878703, -1.80675399, -1.41054201, -1.07736099, -0.799501002, -0.555810988, -0.333402008, -0.132449001, 0.0568020009, 0.254877001, 0.477355003, 0.738685012, 1.04430604, 1.39544594, 1.80987501, 2.39187598, -2.38938308, -1.98846805, -1.75140405, -1.56431198, -1.39221299, -1.216465, -1.04694998, -0.890510023, -0.764558017, -0.645457983, -0.52592802, -0.405954987, -0.302971989, -0.209690005, -0.123986997, -0.0479229987, 0.025773, 0.100134, 0.173718005, 0.258554012, 0.352290004, 0.456988007, 0.576775014, 0.700316012, 0.842552006, 1.00938797, 1.18213499, 1.35345602, 1.53208196, 1.73326194, 1.97223496, 2.39781404, -2.5756309, -2.05733204, -1.89849198, -1.77278101, -1.66626, -1.57421803, -1.49933195, -1.43166399, -1.36522806, -1.30009902, -1.22809303, -1.15885794, -1.09212506, -1.013574, -0.920284986, -0.828705013, -0.737488985, -0.644775987, -0.559094012, -0.485713989, -0.411031991, -0.345970005, -0.285115987, -0.234162003, -0.187058002, -0.144250005, -0.110716999, -0.0739680007, -0.0365610011, -0.00732900016, 0.0203610007, 0.0479039997, 0.0751969963, 0.0980999991, 0.122038998, 0.145899996, 0.169434994, 0.197045997, 0.225243002, 0.255686998, 0.287010014, 0.319709986, 0.352582991, 0.388906986, 0.433492005, 0.476945996, 0.520482004, 0.564453006, 0.612204015, 0.668592989, 0.734165013, 0.803215981, 0.878404021, 0.956620991, 1.03970695, 1.12937701, 1.22111595, 1.30802798, 1.40248001, 1.50568199, 1.62277305, 1.77249599, 1.94308805, 2.29039311, 0],
		_t4 = [0.999981225, 0.999529421, 0.998475611, 0.996820271, 0.994564593, 0.991709828, 0.988257587, 0.984210074, 0.979569793, 0.974339426, 0.968522072, 0.962121427, 0.955141187, 0.947585583, 0.939459205, 0.930767, 0.921513975, 0.911705971, 0.901348829, 0.890448689, 0.879012227, 0.867046177, 0.854557991, 0.841554999, 0.828045011, 0.81403631, 0.799537301, 0.784556627, 0.769103289, 0.753186822, 0.736816585, 0.720002472, 0.702754676, 0.685083687, 0.666999876, 0.64851439, 0.629638195, 0.610382795, 0.590759695, 0.570780694, 0.550458014, 0.529803574, 0.50883007, 0.487550199, 0.465976506, 0.444122106, 0.422000289, 0.399624199, 0.377007395, 0.354163498, 0.331106305, 0.307849586, 0.284407496, 0.260794103, 0.237023607, 0.213110298, 0.189068705, 0.164913103, 0.1406582, 0.116318598, 0.0919089988, 0.0674438998, 0.0429382995, 0.0184067003],
		_t5 = [0.125, 0.124962397, 0.124849401, 0.124661297, 0.124398097, 0.124059901, 0.123647101, 0.123159699, 0.122598201, 0.121962801, 0.1212539, 0.120471999, 0.119617499, 0.118690997, 0.117693, 0.116624102, 0.115484901, 0.114276201, 0.112998702, 0.111653, 0.110240199, 0.108760901, 0.107216097, 0.105606697, 0.103933699, 0.102198102, 0.100400902, 0.0985433012, 0.0966262966, 0.094651103, 0.0926188976, 0.0905309021, 0.0883883014, 0.0861926004, 0.0839449018, 0.0816465989, 0.0792991966, 0.076903902, 0.0744623989, 0.0719759986, 0.069446303, 0.0668746978, 0.0642627999, 0.0616123006, 0.0589246005, 0.0562013984, 0.0534444004, 0.0506552011, 0.0478353985, 0.0449868999, 0.0421111993, 0.0392102003, 0.0362856016, 0.0333391018, 0.0303725004, 0.0273876991, 0.0243862998, 0.0213702004, 0.0183412991, 0.0153013002, 0.0122520998, 0.0091955997, 0.00613350002, 0.00306769996],
		_t6 = [-0.00613590004, -0.0306748003, -0.0551952012, -0.0796824023, -0.104121603, -0.128498107, -0.152797207, -0.177004203, -0.201104596, -0.225083902, -0.248927593, -0.272621393, -0.296150893, -0.319501996, -0.342660695, -0.365613014, -0.388345003, -0.410843194, -0.433093786, -0.455083609, -0.47679919, -0.498227686, -0.519356012, -0.540171504, -0.560661614, -0.580814004, -0.600616515, -0.620057225, -0.639124393, -0.657806695, -0.676092684, -0.693971515, -0.711432219, -0.728464425, -0.745057821, -0.761202395, -0.77688849, -0.792106628, -0.806847572, -0.8211025, -0.834862888, -0.848120272, -0.860866904, -0.873094976, -0.884797096, -0.895966172, -0.906595707, -0.916679084, -0.926210225, -0.935183525, -0.943593502, -0.95143503, -0.958703518, -0.965394378, -0.971503913, -0.977028072, -0.981963873, -0.986308098, -0.990058184, -0.993211925, -0.995767415, -0.997723103, -0.999077678, -0.999830604],
		_t7 = [0.00613590004, 0.0184067003, 0.0306748003, 0.0429382995, 0.0551952012, 0.0674438998, 0.0796824023, 0.0919089988, 0.104121603, 0.116318598, 0.128498107, 0.1406582, 0.152797207, 0.164913103, 0.177004203, 0.189068705, 0.201104596, 0.213110298, 0.225083902, 0.237023607, 0.248927593, 0.260794103, 0.272621393, 0.284407496, 0.296150893, 0.307849586, 0.319501996, 0.331106305, 0.342660695, 0.354163498, 0.365613014, 0.377007395, 0.388345003, 0.399624199, 0.410843194, 0.422000289, 0.433093786, 0.444122106, 0.455083609, 0.465976506, 0.47679919, 0.487550199, 0.498227686, 0.50883007, 0.519356012, 0.529803574, 0.540171504, 0.550458014, 0.560661614, 0.570780694, 0.580814004, 0.590759695, 0.600616515, 0.610382795, 0.620057225, 0.629638195, 0.639124393, 0.64851439, 0.657806695, 0.666999876, 0.676092684, 0.685083687, 0.693971515, 0.702754676, 0.711432219, 0.720002472, 0.728464425, 0.736816585, 0.745057821, 0.753186822, 0.761202395, 0.769103289, 0.77688849, 0.784556627, 0.792106628, 0.799537301, 0.806847572, 0.81403631, 0.8211025, 0.828045011, 0.834862888, 0.841554999, 0.848120272, 0.854557991, 0.860866904, 0.867046177, 0.873094976, 0.879012227, 0.884797096, 0.890448689, 0.895966172, 0.901348829, 0.906595707, 0.911705971, 0.916679084, 0.921513975, 0.926210225, 0.930767, 0.935183525, 0.939459205, 0.943593502, 0.947585583, 0.95143503, 0.955141187, 0.958703518, 0.962121427, 0.965394378, 0.968522072, 0.971503913, 0.974339426, 0.977028072, 0.979569793, 0.981963873, 0.984210074, 0.986308098, 0.988257587, 0.990058184, 0.991709828, 0.993211925, 0.994564593, 0.995767415, 0.996820271, 0.997723103, 0.998475611, 0.999077678, 0.999529421, 0.999830604, 0.999981225],
		_t8 = [32767, 30840, 29127, 27594, 26214, 24966, 23831, 22795, 21845, 20972, 20165, 19418, 18725, 18079, 17476, 16913, 16384, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		_t9 = [0, 0.0122715384, 0.024541229, 0.0368072242, 0.0490676723, 0.061320737, 0.0735645667, 0.0857973099, 0.0980171412, 0.110222213, 0.122410677, 0.134580716, 0.146730468, 0.158858135, 0.170961887, 0.183039889, 0.195090324, 0.207111374, 0.219101235, 0.231058106, 0.242980182, 0.254865646, 0.266712755, 0.27851969, 0.290284693, 0.302005947, 0.313681751, 0.32531029, 0.336889863, 0.348418683, 0.359895051, 0.371317178, 0.382683426, 0.393992037, 0.405241311, 0.416429549, 0.427555084, 0.438616246, 0.449611336, 0.460538715, 0.471396744, 0.482183784, 0.492898196, 0.50353837, 0.514102757, 0.524589658, 0.534997642, 0.545324981, 0.555570245, 0.565731823, 0.575808167, 0.585797846, 0.59569931, 0.605511069, 0.615231574, 0.624859512, 0.634393275, 0.643831551, 0.653172851, 0.662415802, 0.671558976, 0.680601001, 0.689540565, 0.698376238, 0.707106769, 0.715730846, 0.724247098, 0.732654274, 0.740951121, 0.749136388, 0.757208824, 0.765167296, 0.773010433, 0.780737221, 0.78834641, 0.795836926, 0.803207517, 0.81045723, 0.817584813, 0.824589312, 0.831469595, 0.838224709, 0.84485358, 0.851355195, 0.857728601, 0.863972843, 0.870086968, 0.876070082, 0.881921232, 0.887639642, 0.893224299, 0.898674488, 0.903989315, 0.909168005, 0.914209783, 0.919113874, 0.923879504, 0.928506076, 0.932992816, 0.937339008, 0.941544056, 0.945607305, 0.949528158, 0.953306019, 0.956940353, 0.960430503, 0.963776052, 0.966976464, 0.970031261, 0.972939968, 0.975702107, 0.97831738, 0.980785251, 0.983105481, 0.985277653, 0.987301409, 0.989176512, 0.990902662, 0.992479503, 0.993906975, 0.99518472, 0.996312618, 0.997290432, 0.998118103, 0.99879545, 0.999322355, 0.999698818, 0.999924719, 1],
		_3 = function (a) {
			(this.value = 0), (this.shift = 0);
			if (a == 124) {
				(this.value = 4228), (this.shift = 19);
				return;
			} else if (a == 0) {
				(this.value = 0), (this.shift = 0);
				return;
			}
			let b = ((~a >>> 31) << 1) - 1,
				c = a * b,
				d = -1;
			while ((c & (1 << 15)) == 0) (c <<= 1), d++;
			c >>= 1;
			this.shift = 27 - d;
			let e = _t8[(c - 0x3e00) >> 10],
				f = c * e;
			(f = (1 << 30) - f),
				(f += 1 << 14),
				(f >>= 15),
				(f *= e),
				(f += 1 << 14),
				(f >>= 15);
			let g = f;
			(f *= c),
				(f = (1 << 29) - f),
				(f += 1 << 14),
				(f >>= 15),
				(f *= g),
				(f += 1 << 13),
				(f >>= 14),
				(f *= b);
			if (f > 32767 && b == 1) f = 32767;
			else if (f < -32768 && b == -1) f = -32768;
			this.value = f;
		},
		_f1 = function (a, b, c, e, f) {
			var d = 0;
			if (c <= 0) return d | 0;
			var g = 1 << (b - 1);
			for (var i = 0; i < c; ++i) {
				var h = a[i] - f;
				if (h < 0) h = 0;
				else h = (h + g) >> b;
				d += Math.min(h, e);
			}
			return d | 0;
		},
		_f2 = function (a, b, c, d) {
			var e = 0;
			for (var i = 0; i < b; ++i) if (a[i] > e) e = a[i];
			var f = 0,
				g = new _2(e);
			f = g.scale - 16;
			var h = new Int16Array(124);
			if (f < 0) for (var i = 0; i < b; ++i) h[i] = a[i] >> -f;
			else for (var i = 0; i < b; ++i) h[i] = a[i] << f;
			var k = new _3(b);
			for (var i = 0; i < b; ++i) h[i] = (h[i] * 3) >> 2;
			var l = 0;
			for (var i = 0; i < b; ++i) l += h[i];
			(f += 11), (l -= c << f);
			var m = 0,
				n = l - (c << f);
			(g = new _2(n)), (m = ((n >> 16) * k.value) >> 15);
			var o = 31 - k.shift - g.scale;
			if (o >= 0) m <<= o;
			else m >>= -o;
			var p = _f1(h, f, b, 6, m);
			if (p != c) {
				var a1 = p - c,
					a2 = 0;
				if (a1 <= 0) for (; a1 >= -16384; a1 <<= 1) a2++;
				else for (; a1 < 16384; a1 <<= 1) a2++;
				var a3 = (a1 * k.value) >> 15;
				a2 = f - (k.shift + a2 - 15);
				if (a2 >= 0) a3 <<= a2;
				else a3 >>= -a2;
				var a4 = 1,
					b1 = 0,
					b2 = 0;
				for (;;) {
					(b1 = p), (b2 = m), (m += a3), (p = _f1(h, f, b, 6, m));
					if (++a4 > 19) break;
					if ((p - c) * (b1 - c) <= 0) break;
				}
				if (p != c) {
					var b3 = 0,
						b4 = 0,
						b5 = 0;
					if (p > c) (b3 = m), (m = b2), (b4 = p), (b5 = b1);
					else (b3 = b2), (b4 = b1), (b5 = p);
					while (p != c && a4 < 20) {
						var c1 = (m + b3) >> 1;
						p = _f1(h, f, b, 6, c1);
						++a4;
						if (p > c) (b3 = c1), (b4 = p);
						else (m = c1), (b5 = p);
					}
					var c2 = Math.abs((b4 - c) | 0),
						c3 = Math.abs((b5 - c) | 0);
					if (c2 < c3) (m = b3), (p = b4);
					else p = b5;
				}
			}
			for (var i = 0; i < b; ++i) {
				var d1 = h[i] - m;
				if (d1 >= 0) d1 = (d1 + (1 << (f - 1))) >> f;
				else d1 = 0;
				d[i] = Math.min(d1, 6);
			}
			if (p > c) {
				var i = 0,
					d2 = 0;
				for (; d2 < c; ++i) d2 += d[i];
				d2 -= d[i - 1];
				d[i - 1] = c - d2;
				p = c;
				for (; i < b; ++i) d[i] = 0;
			}
			return (c - p) | 0;
		},
		_f3 = function (a, b, c) {
			var f = c << 1,
				j = 1;
			for (var i = 1; i < f; i += 2) {
				if (i < j) {
					var d = a[b + i];
					(a[b + i] = a[b + j]), (a[b + j] = d);
					var e = a[b + i - 1];
					(a[b + i - 1] = a[b + j - 1]), (a[b + j - 1] = e);
				}
				var x = c;
				while (x > 1 && x < j) (j -= x), (x >>= 1);
				j += x;
			}
		},
		_f4 = function (a, b, c) {
			var d = 1 << c,
				j = 0;
			_f3(a, b, d);
			for (var i = d >> 1; i > 0; --i, j += 4) {
				var j0 = a[b + j],
					j1 = a[b + j + 1],
					j2 = a[b + j + 2],
					j3 = a[b + j + 3];
				(a[b + j] = j0 + j2),
					(a[b + j + 1] = j1 + j3),
					(a[b + j + 2] = j0 - j2),
					(a[b + j + 3] = j1 - j3);
			}
			j = 0;
			for (var i = d >> 2; i > 0; --i, j += 8) {
				var j0 = a[b + j],
					j1 = a[b + j + 1],
					j2 = a[b + j + 2],
					j3 = a[b + j + 3],
					j4 = a[b + j + 4],
					j5 = a[b + j + 5],
					j6 = a[b + j + 6],
					j7 = a[b + j + 7];
				(a[b + j] = j0 + j4),
					(a[b + j + 1] = j1 + j5),
					(a[b + j + 2] = j2 + j7),
					(a[b + j + 3] = j3 - j6),
					(a[b + j + 4] = j0 - j4),
					(a[b + j + 5] = j1 - j5),
					(a[b + j + 6] = j2 - j7),
					(a[b + j + 7] = j3 + j6);
			}
			var i = 0,
				x = d >> 3,
				y = 64,
				z = 4;
			for (var idx1 = c - 2; idx1 > 0; --idx1, z <<= 1, y >>= 1, x >>= 1) {
				j = 0;
				for (var idx2 = x; idx2 != 0; --idx2, j += z << 1) {
					for (var idx3 = z >> 1; idx3 > 0; --idx3, j += 2, i += y) {
						var k = j + (z << 1),
							j0 = a[b + j],
							j1 = a[b + j + 1],
							k0 = a[b + k],
							k1 = a[b + k + 1];
						(a[b + k] = j0 - (k0 * _t9[128 - i] + k1 * _t9[i])),
							(a[b + j] = j0 + (k0 * _t9[128 - i] + k1 * _t9[i])),
							(a[b + k + 1] = j1 + (k0 * _t9[i] - k1 * _t9[128 - i])),
							(a[b + j + 1] = j1 - (k0 * _t9[i] - k1 * _t9[128 - i]));
					}
					for (var idx4 = z >> 1; idx4 > 0; --idx4, j += 2, i -= y) {
						var k = j + (z << 1),
							j0 = a[b + j],
							j1 = a[b + j + 1],
							k0 = a[b + k],
							k1 = a[b + k + 1];
						(a[b + k] = j0 + (k0 * _t9[128 - i] - k1 * _t9[i])),
							(a[b + j] = j0 - (k0 * _t9[128 - i] - k1 * _t9[i])),
							(a[b + k + 1] = j1 + (k1 * _t9[128 - i] + k0 * _t9[i])),
							(a[b + j + 1] = j1 - (k1 * _t9[128 - i] + k0 * _t9[i]));
					}
				}
			}
		},
		_f5 = function (a, b, c, d, e) {
			var f = 1 << c,
				g = (f >> 1) - 1,
				h = f >> 2;
			for (var i = 0; i < h; ++i) {
				var i2 = i << 1,
					j = f - 1 - i2,
					k = j - 1,
					in_i2 = a[b + i2],
					in_i2_1 = a[b + i2 + 1],
					in_j = a[b + j],
					in_k = a[b + k];
				(d[e + i2] = _t4[i] * in_i2 - _t6[i] * in_j),
					(d[e + i2 + 1] = in_j * _t4[i] + in_i2 * _t6[i]),
					(d[e + k] = _t4[g - i] * in_k - _t6[g - i] * in_i2_1),
					(d[e + j] = in_i2_1 * _t4[g - i] + in_k * _t6[g - i]);
			}
			_f4(d, e, c - 1);
			var l = d[e + f - 1],
				m = d[e + f - 2];
			(d[e] = _t5[0] * d[e]),
				(d[e + f - 1] = d[e + 1] * -_t5[0]),
				(d[e + f - 2] = _t5[g] * d[e + f - 2] + _t5[1] * l),
				(d[e + 1] = m * _t5[1] - l * _t5[g]);
			var o = f - 3,
				p = g,
				j = 3;
			for (var i = 1; i < h; ++i, --p, o -= 2, j += 2) {
				var q = d[e + o],
					r = d[e + o - 1],
					s = d[e + j],
					t = d[e + j - 1];
				(d[e + j - 1] = _t5[p] * s + _t5[(j - 1) >> 1] * t),
					(d[e + j] = r * _t5[(j + 1) >> 1] - q * _t5[p - 1]),
					(d[e + o] = t * _t5[p] - s * _t5[(j - 1) >> 1]),
					(d[e + o - 1] = _t5[(j + 1) >> 1] * q + _t5[p - 1] * r);
			}
		},
		_f6 = function (a, b, c, d, e) {
			var f = 1 << c,
				g = f >> 2,
				y = f - 1,
				x = f >> 1,
				j = x - 1,
				i = 0;
			_f5(b, 0, c, d, e);
			for (; i < g; ++i, --j, ++x, --y) {
				var h = a[i],
					k = a[j],
					l = d[e + x],
					m = d[e + y];
				(a[i] = -d[e + j]),
					(a[j] = -d[e + i]),
					(d[e + i] = h * _t7[y] + l * _t7[i]),
					(d[e + j] = k * _t7[x] + m * _t7[j]),
					(d[e + x] = _t7[x] * -m + _t7[j] * k),
					(d[e + y] = _t7[y] * -l + _t7[i] * h);
			}
		},
		_f7 = function (a, b, c) {
			const d = new Uint8Array(124),
				e1 = new Float32Array(128),
				e2 = new Float32Array(124),
				e3 = new Float32Array(124),
				f = new Int32Array(124),
				o = new _1();
			var g = o.pop(_o2[0], b);
			(d[0] = g), (e1[0] = _t1[g]);
			for (var i = 1; i < 23; i++)
				(g = o.pop(_o2[i], b)), (d[i] = g), (e1[i] = e1[i - 1] + _t2[g]);
			for (var i = 0; i < 23; i++) {
				var h = Math.pow(2.0, e1[i] * (0.5 * 0.0009765625)),
					k = _o1[i],
					l = _o1[i + 1];
				for (; k < l; ++k) (e3[k] = e1[i]), (e2[k] = h);
			}
			var m = _f2(e3, 124, 198, f);
			for (var n = 0; n < 256; n += 128) {
				for (var i = 0; i < 124; ++i) {
					let h = f[i],
						k = e2[i];
					if (h > 0) {
						let l = 1 << h;
						(g = o.pop(h, b)), (d[i] = g), (k *= _t3[l - 1 + g]);
					} else {
						var p = Math.random() * 4294967296.0;
						if (p < (1 << 30) + (1 << 14)) k *= -0.707099974;
						else k *= 0.707099974;
					}
					e1[i] = k;
				}
				for (var i = 124; i < 128; ++i) e1[i] = 0;
				for (var i = m; i > 0; i -= 8) {
					if (i > 8) o.pop(8, b);
					else {
						o.pop(i, b);
						break;
					}
				}
				_f6(a, e1, 7, c, n);
			}
		},
		_f8 = function (a, b, c, d) {
			var e = 0;
			var f = Math.abs(a - b[c]);
			for (var i = c; i < d; ++i) {
				var g = Math.abs(a - b[i]);
				if (g < f) (f = g), (e = i - c);
			}
			return e;
		},
		_f9 = function (a, b, c, d) {
			var e = c,
				f = d;
			do {
				var g = (e + f) >> 1;
				if (a > b[g]) e = g;
				else f = g;
			} while (f - e > 1);
			if (f != d) if (a - b[e] > b[f] - a) e = f;
			return e - c;
		},
		_f10 = function (a, b, c, d, e, f) {
			var g = 1 << d,
				h = g >> 2,
				y = g - 1,
				x = g >> 1,
				j = x - 1,
				i = 0;
			for (; i < h; ++i, ++x, --y, --j)
				(e[f + x] = a[i]),
					(e[f + y] = a[j]),
					(e[f + i] = -b[c + j] * _t7[x] - b[c + x] * _t7[j]),
					(e[f + j] = -b[c + y] * _t7[i] - b[c + i] * _t7[y]),
					(a[i] = b[c + i] * _t7[i] - b[c + y] * _t7[y]),
					(a[j] = b[c + j] * _t7[j] - b[c + x] * _t7[x]);
			_f5(e, f, d, e, f);
		},
		_f11 = function (q, w, e) {
			const c = new Float32Array(256),
				d = new Float32Array(23),
				f = new Float32Array(23),
				g = new Float32Array(124),
				h = new Float32Array(124),
				j = new Int32Array(124),
				k = new _1();
			_f10(q, w, 0, 7, c, 0);
			_f10(q, w, 128, 7, c, 128);
			for (var i = 0; i < 23; ++i) {
				var l = _o1[i],
					m = _o1[i + 1],
					n = 0.0;
				for (; l < m; ++l) {
					var a = c[l],
						b = c[l + 128];
					n += a * a + b * b;
				}
				var o = Math.max(1.0, n / (_t0[i] << 1));
				d[i] = Math.round(Math.log(o) * (1.44269502 * 1024.0));
			}
			var r = _f8(d[0], _t1, 0, 64);
			f[0] = _t1[r];
			k.push(r, _o2[0], e);
			for (var i = 1; i < 23; ++i) {
				r = _f8(d[i] - f[i - 1], _t2, 0, 32);
				f[i] = f[i - 1] + _t2[r];
				k.push(r, _o2[i], e);
			}
			for (var i = 0; i < 23; ++i)
				d[i] = 1.0 / Math.pow(2.0, f[i] * (0.5 * 0.0009765625));
			for (var i = 0; i < 23; ++i) {
				var l = _o1[i],
					m = _o1[i + 1];
				for (; l < m; ++l) (g[l] = f[i]), (h[l] = d[i]);
			}
			var s = _f2(g, 124, 198, j);
			for (var u = 0; u < 256; u += 128) {
				for (var i = 0; i < 124; ++i) {
					var p = j[i];
					if (p > 0) {
						var t = 1 << p;
						r = _f9(h[i] * c[u + i], _t3, t - 1, (t << 1) - 1);
						k.push(r, p, e);
					}
				}
				for (var i = s; i > 0; i -= 8) {
					if (i > 8) k.push(0, 8, e);
					else {
						k.push(0, i, e);
						break;
					}
				}
			}
		};  
		return {decode: _f7, encode: _f11}
	}());

	const ShapeToRenderer = {
		shapeToRendererInfo: function (shapes) {
			const result = [];
			for (let i = 0; i < shapes.length; i++) {
				const s = shapes[i];
				var obj = s.obj;
				var cmd = s.cmd;
				result.push(this.lagObjToInfo(obj, cmd));
			}
			return result;
		},
		lagObjToInfo: function (obj, cmd) {
			var isLine = "width" in obj;
			if (isLine) {
				return {
					type: 1,
					width: obj.width,
					path2d: cmd,
					fill: this.lineToInfo(obj),
				};
			} else {
				return {
					type: 0,
					path2d: cmd,
					fill: this.fillToInfo(obj),
				};
			}
		},
		fillToInfo: function (fill) {
			var type = fill.type;
			switch (type) {
				case 0:
					var color = fill.color;
					return {
						type: 0,
						color: color,
					};
				case 0x10:
				case 0x12:
				case 0x13:
					var gradient = fill.gradient;
					if (!gradient) 
						gradient = fill.linearGradient;
					if (!gradient) 
						gradient = fill.radialGradient;
					var gradientMatrix = gradient.matrix;
					var isRadial = type !== 16;
					var focal = 0;
					if (type == 19) 
						focal = fill.focalPoint || 0;
					var gradientRecords = gradient.gradientRecords;
					var css = [];
					for (var rIdx = 0; rIdx < gradientRecords.length; rIdx++) {
						var record = gradientRecords[rIdx];
						var color = record.color;
						var ratio = record.ratio;
						css.push([color, ratio]);
					}
					return {
						type: 1,
						matrix: gradientMatrix,
						focal: focal,
						isRadial,
						records: css,
					};
				case 0x40:
				case 0x41:
				case 0x42:
				case 0x43:
					var bitmapId = fill.bitmapId;
					var bMatrix = fill.bitmapMatrix;
					return {
						type: 2,
						matrix: bMatrix,
						id: bitmapId,
						isSmoothed: fill.isSmoothed,
						isRepeating: fill.isRepeating,
					};
				default:
					return null;
			}
		},
		lineToInfo: function (line) {
			if ("fillType" in line) {
				return this.fillToInfo(line.fillType);
			} else {
				return {
					type: 0,
					color: line.color,
				};
			}
		},
	};
	const shapeUtils = {
		calculateShapeBounds: function (shapeRecords) {
			var xMin = Infinity;
			var yMin = Infinity;
			var xMax = -Infinity;
			var yMax = -Infinity;
			function dfgfd(x, y) {
				if (x < xMin) xMin = x;
				if (y < yMin) yMin = y;
				if (x > xMax) xMax = x;
				if (y > yMax) yMax = y;
			}
			var currentPosition = { x: 0, y: 0 };
			var hasShapeRecord = false;
			for (let i = 0; i < shapeRecords.length; i++) {
				const record = shapeRecords[i];
				if (!record) continue;
				hasShapeRecord = true;
				if (record.isChange) {
					if (record.stateMoveTo) {
						currentPosition.x = record.moveX;
						currentPosition.y = record.moveY;
						dfgfd(currentPosition.x, currentPosition.y);
					}
				} else {
					var isCurved = record.isCurved;
					if (isCurved) {
						var _controlX = currentPosition.x + record.controlDeltaX;
						var _controlY = currentPosition.y + record.controlDeltaY;
						currentPosition.x = _controlX + record.anchorDeltaX;
						currentPosition.y = _controlY + record.anchorDeltaY;
						dfgfd(_controlX, _controlY);
						dfgfd(currentPosition.x, currentPosition.y);
					} else {
						currentPosition.x += record.deltaX;
						currentPosition.y += record.deltaY;
						dfgfd(currentPosition.x, currentPosition.y);
					}
				}
			}
			if (hasShapeRecord) {
				return { xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax };
			} else {
				return { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
			}
		},
		convertCurrentPosition: function (src) {
			var array = [];
			var currentPosition = { x: 0, y: 0 };
			for (let i = 0; i < src.length; i++) {
				const record = src[i];
				if (record) {
					if (record.isChange) {
						if (record.stateMoveTo) {
							currentPosition.x = record.moveX;
							currentPosition.y = record.moveY;
						}
						array.push(record);
					} else {
						var isCurved = record.isCurved;
						if (isCurved) {
							var _controlX = currentPosition.x + record.controlDeltaX;
							var _controlY = currentPosition.y + record.controlDeltaY;
							currentPosition.x = _controlX + record.anchorDeltaX;
							currentPosition.y = _controlY + record.anchorDeltaY;
							array.push({
								controlX: _controlX,
								controlY: _controlY,
								anchorX: currentPosition.x,
								anchorY: currentPosition.y,
								isCurved: true,
								isChange: false,
							});
						} else {
							currentPosition.x += record.deltaX;
							currentPosition.y += record.deltaY;
							array.push({
								controlX: 0,
								controlY: 0,
								anchorX: currentPosition.x,
								anchorY: currentPosition.y,
								isCurved: false,
								isChange: false,
							});
						}
					}
				} else {
					array.push(null);
				}
			}
			array.push(null);
			return array;
		},
		convertWithCacheCodes: function (shapeRecords) {
			var records = this.convertCurrentPosition(shapeRecords);
			var _cmd = [];
			for (var i = 0; i < records.length; i++) {
				var record = records[i];
				if (!record) break;
				var isCurved = record.isCurved;
				var isChange = record.isChange;
				var code;
				if (isChange) {
					code = [0, record.moveX || 0, record.moveY || 0];
				} else {
					if (isCurved) {
						code = [
							1,
							record.controlX,
							record.controlY,
							record.anchorX,
							record.anchorY,
						];
					} else {
						code = [2, record.anchorX, record.anchorY];
					}
				}
				_cmd.push(code);
			}
			return [
				{
					type: 0,
					path2d: _cmd,
					fill: {
						type: 0,
						color: [255, 255, 255, 1],
					},
				},
			];
		},
		convert: function (shapes, type) {
			var isMorph = type == "morphshape";
			var lineStyles = shapes.lineStyles || [];
			var fillStyles = shapes.fillStyles || [];
			var records = this.convertCurrentPosition(shapes.shapeRecords);
			var idx = 0;
			var obj = {};
			var cache = [];
			var AnchorX = 0;
			var AnchorY = 0;
			var MoveX = 0;
			var MoveY = 0;
			var LineX = 0;
			var LineY = 0;
			var FillStyle0 = 0;
			var FillStyle1 = 0;
			var LineStyle = 0;
			var fills0 = [];
			var fills1 = [];
			var lines = [];
			var stack = [];
			var depth = 0;
			var length = records.length;
			for (var i = 0; i < length; i++) {
				var record = records[i];
				if (!record) {
					this.setStack(stack, this.fillMerge(fills0, fills1, isMorph));
					this.setStack(stack, lines);
					break;
				}
				if (record.isChange) {
					depth++;
					if (record.stateNewStyles) {
						AnchorX = 0;
						AnchorY = 0;
						this.setStack(stack, this.fillMerge(fills0, fills1, isMorph));
						this.setStack(stack, lines);
						fills0 = [];
						fills1 = [];
						lines = [];
						if (record.numFillBits) fillStyles = record.fillStyles;
						if (record.numLineBits) lineStyles = record.lineStyles;
					}
					MoveX = AnchorX;
					MoveY = AnchorY;
					if (record.stateMoveTo) {
						MoveX = record.moveX;
						MoveY = record.moveY;
					}
					LineX = MoveX;
					LineY = MoveY;
					if (record.stateFillStyle0) FillStyle0 = record.fillStyle0;
					if (record.stateFillStyle1) FillStyle1 = record.fillStyle1;
					if (record.stateLineStyle) LineStyle = record.lineStyle;
				} else {
					var isCurved = record.isCurved;
					AnchorX = record.anchorX;
					AnchorY = record.anchorY;
					var ControlX = record.controlX;
					var ControlY = record.controlY;
					if (FillStyle0) {
						idx = FillStyle0 - 1;
						if (!(idx in fills0)) fills0[idx] = [];
						if (!(depth in fills0[idx])) {
							fills0[idx][depth] = {
								obj: fillStyles[idx],
								startX: MoveX,
								startY: MoveY,
								endX: 0,
								endY: 0,
								cache: [],
							};
						}
						obj = fills0[idx][depth];
						cache = obj.cache;
						cache[cache.length] = JSON.parse(JSON.stringify(record));
						obj.endX = AnchorX;
						obj.endY = AnchorY;
					}
					if (FillStyle1) {
						idx = FillStyle1 - 1;
						if (!(idx in fills1)) fills1[idx] = [];
						if (!(depth in fills1[idx])) {
							fills1[idx][depth] = {
								obj: fillStyles[idx],
								startX: MoveX,
								startY: MoveY,
								endX: 0,
								endY: 0,
								cache: [],
							};
						}
						obj = fills1[idx][depth];
						cache = obj.cache;
						cache[cache.length] = JSON.parse(JSON.stringify(record));
						obj.endX = AnchorX;
						obj.endY = AnchorY;
					}
					if (LineStyle) {
						idx = LineStyle - 1;
						if (!(idx in lines)) {
							lines[idx] = {
								obj: lineStyles[idx],
								cache: [],
							};
						}
						obj = lines[idx];
						cache = obj.cache;
						cache[cache.length] = [0, LineX, LineY];
						var code = [2, AnchorX, AnchorY];
						if (isCurved) {
							code = [1, ControlX, ControlY, AnchorX, AnchorY];
						}
						cache[cache.length] = code;
					}
					LineX = AnchorX;
					LineY = AnchorY;
				}
			}
			return ShapeToRenderer.shapeToRendererInfo(stack);
		},
		fillMerge: function (fills0, fills1, isMorph) {
			fills0 = this.fillReverse(fills0);
			if (fills0.length) {
				for (var i in fills0) {
					if (!fills0.hasOwnProperty(i)) continue;
					var fills = fills0[i];
					if (i in fills1) {
						var fill1 = fills1[i];
						for (var depth in fills) {
							if (!fills.hasOwnProperty(depth)) continue;
							fill1[fill1.length] = fills[depth];
						}
					} else {
						fills1[i] = fills;
					}
				}
			}
			return this.coordinateAdjustment(fills1, isMorph);
		},
		fillReverse: function (fills0) {
			if (!fills0.length) return fills0;
			for (var i in fills0) {
				if (!fills0.hasOwnProperty(i)) continue;
				var fills = fills0[i];
				for (var depth in fills) {
					if (!fills.hasOwnProperty(depth)) continue;
					var AnchorX = 0;
					var AnchorY = 0;
					var obj = fills[depth];
					var cacheX = obj.startX;
					var cacheY = obj.startY;
					var cache = obj.cache;
					var length = cache.length;
					if (length) {
						for (var idx in cache) {
							if (!cache.hasOwnProperty(idx)) continue;
							var recode = cache[idx];
							AnchorX = recode.anchorX;
							AnchorY = recode.anchorY;
							recode.anchorX = cacheX;
							recode.anchorY = cacheY;
							cacheX = AnchorX;
							cacheY = AnchorY;
						}
						var array = [];
						if (length > 0) {
							while (length--) {
								array[array.length] = cache[length];
							}
						}
						obj.cache = array;
					}
					cacheX = obj.startX;
					cacheY = obj.startY;
					obj.startX = obj.endX;
					obj.startY = obj.endY;
					obj.endX = cacheX;
					obj.endY = cacheY;
				}
			}
			return fills0;
		},
		coordinateAdjustment: function (fills1, isMorph) {
			for (var i in fills1) {
				if (!fills1.hasOwnProperty(i)) {
					continue;
				}
				var array = [];
				var fills = fills1[i];
				for (var depth in fills) {
					if (!fills.hasOwnProperty(depth)) continue;
					array[array.length] = fills[depth];
				}
				var adjustment = [];
				if (array.length > 1 && !isMorph) {
					while (true) {
						if (!array.length) break;
						var fill = array.shift();
						if (fill.startX === fill.endX && fill.startY === fill.endY) {
							adjustment[adjustment.length] = fill;
							continue;
						}
						var mLen = array.length;
						if (mLen < 0) break;
						var isMatch = 0;
						while (mLen--) {
							var comparison = array[mLen];
							if (
								comparison.startX === fill.endX &&
								comparison.startY === fill.endY
							) {
								fill.endX = comparison.endX;
								fill.endY = comparison.endY;
								var cache0 = fill.cache;
								var cache1 = comparison.cache;
								var cLen = cache1.length;
								for (var cIdx = 0; cIdx < cLen; cIdx++) {
									cache0[cache0.length] = cache1[cIdx];
								}
								array.splice(mLen, 1);
								array.unshift(fill);
								isMatch = 1;
								break;
							}
						}
						if (!isMatch) {
							array.unshift(fill);
						}
					}
				} else {
					adjustment = array;
				}
				var aLen = adjustment.length;
				var cache = [];
				var obj = {};
				for (var idx = 0; idx < aLen; idx++) {
					var data = adjustment[idx];
					obj = data.obj;
					var caches = data.cache;
					var cacheLength = caches.length;
					cache[cache.length] = [0, data.startX, data.startY];
					for (var compIdx = 0; compIdx < cacheLength; compIdx++) {
						var r = caches[compIdx];
						var code = [2, r.anchorX, r.anchorY];
						if (r.isCurved)
							code = [1, r.controlX, r.controlY, r.anchorX, r.anchorY];
						cache[cache.length] = code;
					}
				}
				fills1[i] = { cache: cache, obj: obj };
			}
			return fills1;
		},
		setStack: function (stack, array) {
			if (array.length) {
				for (var i in array) {
					if (!array.hasOwnProperty(i)) continue;
					var data = array[i];
					stack.push({
						obj: data.obj,
						cmd: data.cache,
					});
				}
			}
		},
	};

	const SwfTypes = {
		tags: {0: "End", 1: "ShowFrame", 2: "DefineShape", 4: "PlaceObject", 5: "RemoveObject", 6: "DefineBits", 7: "DefineButton", 8: "JpegTables", 9: "SetBackgroundColor", 10: "DefineFont", 11: "DefineText", 12: "DoAction", 13: "DefineFontInfo", 14: "DefineSound", 15: "StartSound", 17: "DefineButtonSound", 18: "SoundStreamHead", 19: "SoundStreamBlock", 20: "DefineBitsLossless", 21: "DefineBitsJpeg2", 22: "DefineShape2", 23: "DefineButtonCxform", 24: "Protect", 26: "PlaceObject2", 28: "RemoveObject2", 32: "DefineShape3", 33: "DefineText2", 34: "DefineButton2", 35: "DefineBitsJpeg3", 36: "DefineBitsLossless2", 37: "DefineEditText", 39: "DefineSprite", 40: "NameCharacter", 41: "ProductInfo", 43: "FrameLabel", 45: "SoundStreamHead2", 46: "DefineMorphShape", 48: "DefineFont2", 56: "ExportAssets", 57: "ImportAssets", 58: "EnableDebugger", 59: "DoInitAction", 60: "DefineVideoStream", 61: "VideoFrame", 62: "DefineFontInfo2", 63: "DebugId", 64: "EnableDebugger2", 65: "ScriptLimits", 66: "SetTabIndex", 69: "FileAttributes", 70: "PlaceObject3", 71: "ImportAssets2", 72: "DoAbc", 73: "DefineFontAlignZones", 74: "CsmTextSettings", 75: "DefineFont3", 76: "SymbolClass", 77: "Metadata", 78: "DefineScalingGrid", 82: "DoAbc2", 83: "DefineShape4", 84: "DefineMorphShape2", 86: "DefineSceneAndFrameLabelData", 87: "DefineBinaryData", 88: "DefineFontName", 89: "StartSound2", 90: "DefineBitsJpeg4", 91: "DefineFont4", 93: "EnableTelemetry", 94: "PlaceObject4"},
		sound: {
			compression: {
				0: "uncompressedUnknownEndian",
				1: "ADPCM",
				2: "MP3",
				3: "uncompressed",
				4: "nellymoser16Khz",
				5: "nellymoser8Khz",
				6: "nellymoser",
				11: "speex",
			},
			sampleRate: {
				0: 5512,
				1: 11025,
				2: 22050,
				3: 44100,
			},
		},
		video: {
			codec: {
				0: "none",
				2: "H263",
				3: "ScreenVideo",
				4: "Vp6",
				5: "Vp6WithAlpha",
				6: "ScreenVideoV2",
			},
			deblocking: {
				0: "useVideoPacketValue",
				1: "none",
				2: "Level1",
				3: "Level2",
				4: "Level3",
				5: "Level4",
			},
		},
	};

	const SwfInput = function (byte_input, version) {
		this.input = byte_input;
		this._swfVersion = version;
	};
	SwfInput.decompressSwf = function (swfData) {
		var byte_input = new ByteInput(swfData);
		var compression = byte_input.readString(3);
		var version = byte_input.readUint8();
		if (version == 0) {
			throw new Error("this data is not swf version");
		}
		var uncompressedLength = byte_input.readUint32();
		switch (compression) {
			case "FWS":
				break;
			case "CWS":
				var data = ZLib.decompress(swfData, uncompressedLength, 8);
				byte_input = new ByteInput(data);
				byte_input.setOffset(8, 0);
				break;
			case "ZWS":
				byte_input = new ByteInput(
					LZMA.parse(new Uint8Array(swfData), uncompressedLength).buffer
				);
				byte_input.setOffset(8, 0);
				break;
			default:
				throw new Error("this data is not swf.");
		}
		var reader = new SwfInput(byte_input, version);
		var stageSize = reader.rect();
		var frameRate = byte_input.readFixed8();
		var numFrames = byte_input.readUint16();
		var header = {
			compression,
			version,
			stageSize,
			frameRate,
			numFrames,
		};
		var dataStream = byte_input.extract(
			byte_input.length - byte_input.position
		);
		var tag = reader.parseTag();
		var fileAttributes;
		if (tag.tagcode == 69) {
			fileAttributes = tag;
			tag = reader.parseTag();
		} else {
			fileAttributes = {
				useDirectBlit: 0,
				useGPU: 0,
				hasMetadata: 0,
				isActionScript3: 0,
				useNetworkSandbox: 0,
			};
		}
		var backgroundColor = [255, 255, 255, 1];
		for (let i = 0; i < 2; i++) {
			if (tag.tagcode == 9) backgroundColor = tag.rgb;
			tag = reader.parseTag();
		}
		return {
			header: {
				header,
				fileAttributes,
				backgroundColor,
				uncompressedLength,
			},
			dataStream,
		};
	};
	SwfInput.prototype.emitMessage = function (message, type) {
		switch (type) {
			case "warn":
				console.log("WARN:" + message);
				break;
			case "error":
				console.log("ERROR:" + message);
				break;
		}
		return "unknown";
	};
	SwfInput.prototype.parseTags = function () {
		var tags = [];
		while (true) {
			var tag = this.parseTag();
			if (tag.tagcode == 0) break;
			tags.push(tag);
		}
		return tags;
	};
	SwfInput.prototype.parseTag = function () {
		var { tagcode, length } = this.parseTagCodeLength();
		var result = this.parseTagWithCode(tagcode, length);
		result.tagcode = tagcode;
		return result;
	};
	SwfInput.prototype.parseTagCodeLength = function () {
		var tagCodeAndLength = this.input.readUint16();
		var tagcode = tagCodeAndLength >> 6;
		var length = tagCodeAndLength & 0b111111;
		if (length == 0b111111) length = this.input.readUint32();
		return { tagcode, length };
	};
	SwfInput.prototype.parseTagWithCode = function (tagType, length) {
		var tagReader = new SwfInput(this.input.extract(length), this._swfVersion);
		this.input.position += length;
		var byte_input = tagReader.input;
		var obj = {};
		switch (tagType) {
			case 0:
			case 1:
				break;
			case 2:
				obj = tagReader.parseDefineShape(1);
				break;
			case 22:
				obj = tagReader.parseDefineShape(2);
				break;
			case 32:
				obj = tagReader.parseDefineShape(3);
				break;
			case 83:
				obj = tagReader.parseDefineShape(4);
				break;
			case 6:
				obj = tagReader.parseDefineBits(1, length);
				break;
			case 21:
				obj = tagReader.parseDefineBits(2, length);
				break;
			case 35:
				obj = tagReader.parseDefineBits(3, length);
				break;
			case 90:
				obj = tagReader.parseDefineBits(4, length);
				break;
			case 7:
				obj = tagReader.parseDefineButton(1, length);
				break;
			case 34:
				obj = tagReader.parseDefineButton(2, length);
				break;
			case 10:
				obj = tagReader.parseDefineFont1(length);
				break;
			case 48:
				obj = tagReader.parseDefineFont2(2, length);
				break;
			case 75:
				obj = tagReader.parseDefineFont2(3, length);
				break;
			case 91:
				obj = tagReader.parseDefineFont4(length);
				break;
			case 11:
				obj = tagReader.parseDefineText(1);
				break;
			case 33:
				obj = tagReader.parseDefineText(2);
				break;
			case 13:
				obj = tagReader.parseDefineFontInfo(1, length);
				break;
			case 62:
				obj = tagReader.parseDefineFontInfo(2, length);
				break;
			case 14:
				obj = tagReader.parseDefineSound(length);
				break;
			case 17:
				obj = tagReader.parseDefineButtonSound();
				break;
			case 20:
				obj = tagReader.parseDefineBitsLossLess(1, length);
				break;
			case 36:
				obj = tagReader.parseDefineBitsLossLess(2, length);
				break;
			case 23:
				obj = tagReader.parseDefineButtonCxform(length);
				break;
			case 37:
				obj = tagReader.parseDefineEditText();
				break;
			case 39:
				obj = tagReader.parseDefineSprite();
				break;
			case 46:
				obj = tagReader.parseDefineMorphShape(1);
				break;
			case 84:
				obj = tagReader.parseDefineMorphShape(2);
				break;
			case 60:
				obj = tagReader.parseDefineVideoStream();
				break;
			case 73:
				obj = tagReader.parseDefineFontAlignZones(length);
				break;
			case 78:
				obj = tagReader.parseDefineScalingGrid();
				break;
			case 86:
				obj = tagReader.parseDefineSceneAndFrameLabelData();
				break;
			case 87:
				obj = tagReader.parseDefineBinaryData(length);
				break;
			case 88:
				obj = tagReader.parseDefineFontName();
				break;
			case 4:
				obj = tagReader.parsePlaceObject(1, length);
				break;
			case 26:
				obj = tagReader.parsePlaceObject(2, length);
				break;
			case 70:
				obj = tagReader.parsePlaceObject(3, length);
				break;
			case 94:
				obj = tagReader.parsePlaceObject(4, length);
				break;
			case 5:
				obj = tagReader.parseRemoveObject(1);
				break;
			case 28:
				obj = tagReader.parseRemoveObject(2);
				break;
			case 8:
				obj.jpegtable = byte_input.readBytes(length);
				break;
			case 9:
				obj.rgb = tagReader.rgb();
				break;
			case 12:
				obj = tagReader.parseDoAction(length);
				break;
			case 15:
				obj = tagReader.parseStartSound(1);
				break;
			case 89:
				obj = tagReader.parseStartSound(2);
				break;
			case 18:
				obj = tagReader.parseSoundStreamHead(1);
				break;
			case 45:
				obj = tagReader.parseSoundStreamHead(2);
				break;
			case 19:
				obj = tagReader.parseSoundStreamBlock(length);
				break;
			case 24:
				if (length > 0) {
					byte_input.readUint16();
					obj.data = byte_input.readBytes(length - 2);
				}
				break;
			case 40:
				obj = tagReader.parseNameCharacter();
				break;
			case 41:
				obj = tagReader.parseProductInfo();
				break;
			case 43:
				obj = tagReader.parseFrameLabel(length);
				break;
			case 56:
				obj = tagReader.parseExportAssets();
				break;
			case 57:
				obj = tagReader.parseImportAssets(1);
				break;
			case 71:
				obj = tagReader.parseImportAssets(2);
				break;
			case 58:
				obj.debugger = byte_input.readStringWithUntil();
				break;
			case 64:
				byte_input.readUint16();
				obj.debugger = byte_input.readStringWithUntil();
				break;
			case 59:
				obj = tagReader.parseDoInitAction(length);
				break;
			case 61:
				obj = tagReader.parseVideoFrame(length);
				break;
			case 63:
				obj = tagReader.parseDebugID(length);
				break;
			case 65:
				obj.maxRecursionDepth = byte_input.readUint16();
				obj.timeoutSeconds = byte_input.readUint16();
				break;
			case 66:
				obj.depth = byte_input.readUint16();
				obj.tabIndex = byte_input.readUint16();
				break;
			case 69:
				obj = tagReader.parseFileAttributes();
				break;
			case 72:
				obj = tagReader.parseDoABC(1, length);
				break;
			case 82:
				obj = tagReader.parseDoABC(2, length);
				break;
			case 74:
				obj = tagReader.parseCSMTextSettings();
				break;
			case 76:
				obj = tagReader.parseSymbolClass();
				break;
			case 77:
				obj.metadata = byte_input.readStringWithUntil();
				break;
			case 93:
				byte_input.readUint16();
				if (length > 2) {
					obj.passwordHash = byte_input.readBytes(32);
				}
				break;
			case 3: // FreeCharacter
			case 16: // StopSound
			case 25: // PathsArePostScript
			case 29: // SyncFrame
			case 31: // FreeAll
			case 38: // DefineVideo
			case 42: // DefineTextFormat
			case 44: // DefineBehavior
			case 47: // FrameTag
			case 49: // GeProSet
			case 50: // DefineCommandObject
			case 51: // CharacterSet
			case 52: // FontRef
			case 53: // DefineFunction
			case 54: // PlaceFunction
			case 55: // GenTagObject
				console.log("[base] tagType -> " + tagType);
				break;
			case 27: // 27 (invalid)
			case 30: // 30 (invalid)
			case 67: // 67 (invalid)
			case 68: // 68 (invalid)
			case 79: // 79 (invalid)
			case 80: // 80 (invalid)
			case 81: // 81 (invalid)
			case 85: // 85 (invalid)
			case 92: // 92 (invalid)
				break;
			default: // null
				break;
		}
		return obj;
	};
	//////// color rect matrix ////////
	SwfInput.prototype.rect = function () {
		const byte_input = this.input;
		byte_input.byteAlign();
		var nBits = byte_input.readUB(5);
		const obj = {};
		obj.xMin = byte_input.readSB(nBits);
		obj.xMax = byte_input.readSB(nBits);
		obj.yMin = byte_input.readSB(nBits);
		obj.yMax = byte_input.readSB(nBits);
		return obj;
	};
	SwfInput.prototype.rgb = function () {
		const byte_input = this.input;
		return [
			byte_input.readUint8(),
			byte_input.readUint8(),
			byte_input.readUint8(),
			1,
		];
	};
	SwfInput.prototype.rgba = function () {
		const byte_input = this.input;
		return [
			byte_input.readUint8(),
			byte_input.readUint8(),
			byte_input.readUint8(),
			byte_input.readUint8() / 255,
		];
	};
	SwfInput.prototype.colorTransform = function (hasAlpha) {
		const byte_input = this.input;
		byte_input.byteAlign();
		var result = [1, 1, 1, 1, 0, 0, 0, 0];
		var first6bits = byte_input.readUB(6);
		var hasAddTerms = first6bits >> 5;
		var hasMultiTerms = (first6bits >> 4) & 1;
		var nbits = first6bits & 0x0f;
		if (hasMultiTerms) {
			result[0] = byte_input.readSBFixed8(nbits);
			result[1] = byte_input.readSBFixed8(nbits);
			result[2] = byte_input.readSBFixed8(nbits);
			if (hasAlpha) {
				result[3] = byte_input.readSBFixed8(nbits);
			}
		}
		if (hasAddTerms) {
			result[4] = byte_input.readSB(nbits);
			result[5] = byte_input.readSB(nbits);
			result[6] = byte_input.readSB(nbits);
			if (hasAlpha) {
				result[7] = byte_input.readSB(nbits);
			}
		}
		return result;
	};
	SwfInput.prototype.matrix = function () {
		const byte_input = this.input;
		byte_input.byteAlign();
		var result = [1, 0, 0, 1, 0, 0];
		// Scale
		if (byte_input.readUB(1)) {
			var nScaleBits = byte_input.readUB(5);
			result[0] = byte_input.readSBFixed16(nScaleBits);
			result[3] = byte_input.readSBFixed16(nScaleBits);
		}
		// Rotate/Skew
		if (byte_input.readUB(1)) {
			var nRotateBits = byte_input.readUB(5);
			result[1] = byte_input.readSBFixed16(nRotateBits);
			result[2] = byte_input.readSBFixed16(nRotateBits);
		}
		// Translate (always present)
		var nTranslateBits = byte_input.readUB(5);
		result[4] = byte_input.readSB(nTranslateBits);
		result[5] = byte_input.readSB(nTranslateBits);
		return result;
	};
	//////// Structure ////////
	//////// Shapes ////////
	SwfInput.prototype.fillStyleArray = function (shapeVersion) {
		const byte_input = this.input;
		var count = byte_input.readUint8();
		if (shapeVersion >= 2 && count == 0xff) count = byte_input.readUint16();
		var fillStyles = [];
		while (count--) {
			fillStyles.push(this.fillStyle(shapeVersion));
		}
		return fillStyles;
	};
	SwfInput.prototype.gradient = function (shapeVersion) {
		const byte_input = this.input;
		var matrix = this.matrix();
		var flags = byte_input.readUint8();
		var spreadMode = (flags >> 6) & 0b11;
		var interpolationMode = (flags >> 4) & 0b11;
		var numGradients = flags & 0b1111;
		var gradientRecords = [];
		for (var i = numGradients; i--; ) {
			var ratio = byte_input.readUint8() / 255;
			var color = shapeVersion >= 3 ? this.rgba() : this.rgb();
			gradientRecords.push({ ratio, color });
		}
		return {
			spreadMode,
			interpolationMode,
			gradientRecords,
			matrix: matrix,
		};
	};
	SwfInput.prototype.fillStyle = function (shapeVersion) {
		const byte_input = this.input;
		const obj = {};
		var bitType = byte_input.readUint8();
		obj.type = bitType;
		switch (bitType) {
			case 0x00:
				if (shapeVersion >= 3) obj.color = this.rgba();
				else obj.color = this.rgb();
				break;
			case 0x10:
				obj.linearGradient = this.gradient(shapeVersion);
				break;
			case 0x12:
				obj.radialGradient = this.gradient(shapeVersion);
				break;
			case 0x13:
				obj.gradient = this.gradient(shapeVersion);
				obj.focalPoint = byte_input.readFixed8();
				break;
			case 0x40:
			case 0x41:
			case 0x42:
			case 0x43:
				obj.bitmapId = byte_input.readUint16();
				obj.bitmapMatrix = this.matrix();
				obj.isSmoothed = this._swfVersion >= 8 && (bitType & 0b10) == 0;
				obj.isRepeating = bitType & 0b01;
				break;
			default:
				this.emitMessage("Invalid fill style: " + bitType, "error");
				break;
		}
		return obj;
	};
	SwfInput.prototype.lineStyleArray = function (shapeVersion) {
		const byte_input = this.input;
		var count = byte_input.readUint8();
		if (shapeVersion >= 2 && count === 0xff) count = byte_input.readUint16();
		var lineStyles = [];
		while (count--) lineStyles.push(this.lineStyles(shapeVersion));
		return lineStyles;
	};
	SwfInput.prototype.lineStyles = function (shapeVersion) {
		const byte_input = this.input;
		const obj = {};
		obj.width = byte_input.readUint16();
		if (shapeVersion == 4) {
			obj.startCapStyle = byte_input.readUB(2);
			obj.joinStyle = byte_input.readUB(2);
			obj.hasFill = byte_input.readUB(1);
			obj.noHScale = byte_input.readUB(1);
			obj.noVScale = byte_input.readUB(1);
			obj.pixelHinting = byte_input.readUB(1);
			byte_input.readUB(5);
			obj.noClose = byte_input.readUB(1);
			obj.endCapStyle = byte_input.readUB(2);
			if (obj.joinStyle === 2) obj.miterLimitFactor = byte_input.readFixed8();
			if (obj.hasFill) obj.fillType = this.fillStyle(shapeVersion);
			else obj.color = this.rgba();
		} else {
			// LineStyle1
			obj.color = shapeVersion >= 3 ? this.rgba() : this.rgb();
		}
		return obj;
	};
	SwfInput.prototype.shapeRecords = function (shapeVersion, currentNumBits) {
		const byte_input = this.input;
		const shapeRecords = [];
		while (true) {
			var first6Bits = byte_input.readUB(6);
			var shape = null;
			if (first6Bits & 0x20) {
				var numBits = first6Bits & 0b1111;
				if (first6Bits & 0x10) {
					shape = this.straightEdgeRecord(numBits);
				} else {
					shape = this.curvedEdgeRecord(numBits);
				}
			} else {
				if (first6Bits)
					shape = this.styleChangeRecord(
						shapeVersion,
						first6Bits,
						currentNumBits
					);
			}
			if (!shape) {
				byte_input.byteAlign();
				break;
			} else {
				shapeRecords.push(shape);
			}
		}
		return shapeRecords;
	};
	SwfInput.prototype.straightEdgeRecord = function (numBits) {
		const byte_input = this.input;
		var deltaX = 0;
		var deltaY = 0;
		var GeneralLineFlag = byte_input.readUB(1);
		if (GeneralLineFlag) {
			deltaX = byte_input.readSB(numBits + 2);
			deltaY = byte_input.readSB(numBits + 2);
		} else {
			var VertLineFlag = byte_input.readUB(1);
			if (VertLineFlag) {
				deltaX = 0;
				deltaY = byte_input.readSB(numBits + 2);
			} else {
				deltaX = byte_input.readSB(numBits + 2);
				deltaY = 0;
			}
		}
		return {
			deltaX,
			deltaY,
			isCurved: false,
			isChange: false,
		};
	};
	SwfInput.prototype.curvedEdgeRecord = function (numBits) {
		const byte_input = this.input;
		var controlDeltaX = byte_input.readSB(numBits + 2);
		var controlDeltaY = byte_input.readSB(numBits + 2);
		var anchorDeltaX = byte_input.readSB(numBits + 2);
		var anchorDeltaY = byte_input.readSB(numBits + 2);
		return {
			controlDeltaX,
			controlDeltaY,
			anchorDeltaX,
			anchorDeltaY,
			isCurved: true,
			isChange: false,
		};
	};
	SwfInput.prototype.styleChangeRecord = function (
		shapeVersion,
		changeFlag,
		currentNumBits
	) {
		const byte_input = this.input;
		const obj = {};
		obj.stateMoveTo = changeFlag & 1;
		obj.stateFillStyle0 = (changeFlag >> 1) & 1;
		obj.stateFillStyle1 = (changeFlag >> 2) & 1;
		obj.stateLineStyle = (changeFlag >> 3) & 1;
		obj.stateNewStyles = (changeFlag >> 4) & 1;
		if (obj.stateMoveTo) {
			var moveBits = byte_input.readUB(5);
			obj.moveX = byte_input.readSB(moveBits);
			obj.moveY = byte_input.readSB(moveBits);
		}
		obj.fillStyle0 = 0;
		if (obj.stateFillStyle0)
			obj.fillStyle0 = byte_input.readUB(currentNumBits.fillBits);
		obj.fillStyle1 = 0;
		if (obj.stateFillStyle1)
			obj.fillStyle1 = byte_input.readUB(currentNumBits.fillBits);
		obj.lineStyle = 0;
		if (obj.stateLineStyle)
			obj.lineStyle = byte_input.readUB(currentNumBits.lineBits);
		if (obj.stateNewStyles) {
			obj.fillStyles = this.fillStyleArray(shapeVersion);
			obj.lineStyles = this.lineStyleArray(shapeVersion);
			var numBits = byte_input.readUint8();
			currentNumBits.fillBits = obj.numFillBits = numBits >> 4;
			currentNumBits.lineBits = obj.numLineBits = numBits & 0b1111;
		}
		obj.isChange = true;
		return obj;
	};
	SwfInput.prototype.morphFillStyleArray = function (shapeVersion) {
		const byte_input = this.input;
		var fillStyleCount = byte_input.readUint8();
		if (shapeVersion >= 2 && fillStyleCount == 0xff)
			fillStyleCount = byte_input.readUint16();
		var fillStyles = [];
		for (var i = fillStyleCount; i--; ) 
			fillStyles.push(this.morphFillStyle());
		return fillStyles;
	};
	SwfInput.prototype.morphFillStyle = function () {
		const byte_input = this.input;
		const obj = {};
		var bitType = byte_input.readUint8();
		obj.type = bitType;
		switch (bitType) {
			case 0x00:
				obj.startColor = this.rgba();
				obj.endColor = this.rgba();
				break;
			case 0x10:
				obj.linearGradient = this.morphGradient();
				break;
			case 0x12:
				obj.radialGradient = this.morphGradient();
				break;
			case 0x13:
				// SWF19 says focal gradients are only allowed in SWFv8+ and DefineMorphShape2,
				// but it works even in earlier tags (#2730).
				// TODO(Herschel): How is focal_point stored?
				obj.gradient = this.morphGradient();
				obj.startFocalPoint = byte_input.readFixed8();
				obj.endFocalPoint = byte_input.readFixed8();
				break;
			case 0x40:
			case 0x41:
			case 0x42:
			case 0x43:
				obj.bitmapId = byte_input.readUint16();
				obj.bitmapStartMatrix = this.matrix();
				obj.bitmapEndMatrix = this.matrix();
				obj.isSmoothed = (bitType & 0b10) == 0;
				obj.isRepeating = (bitType & 0b01) == 0;
				break;
			default:
				this.emitMessage("Invalid fill style: " + bitType, "error");
		}
		return obj;
	};
	SwfInput.prototype.morphGradient = function () {
		const obj = {};
		const byte_input = this.input;
		obj.startMatrix = this.matrix();
		obj.endMatrix = this.matrix();
		var flags = byte_input.readUint8();
		obj.spreadMode = (flags >> 6) & 0b11;
		obj.interpolationMode = (flags >> 4) & 0b11;
		var numGradients = flags & 0b1111;
		var gradientRecords = [];
		for (var i = numGradients; i--; ) {
			gradientRecords.push({
				startRatio: byte_input.readUint8() / 255,
				startColor: this.rgba(),
				endRatio: byte_input.readUint8() / 255,
				endColor: this.rgba(),
			});
		}
		obj.gradientRecords = gradientRecords;
		return obj;
	};
	SwfInput.prototype.morphLineStyleArray = function (shapeVersion) {
		const byte_input = this.input;
		var lineStyleCount = byte_input.readUint8();
		if (shapeVersion >= 2 && lineStyleCount == 0xff)
			lineStyleCount = byte_input.readUint16();
		const lineStyles = [];
		for (var i = lineStyleCount; i--; )
			lineStyles.push(this.morphLineStyle(shapeVersion));
		return lineStyles;
	};
	SwfInput.prototype.morphLineStyle = function (shapeVersion) {
		const byte_input = this.input;
		const obj = {};
		obj.startWidth = byte_input.readUint16();
		obj.endWidth = byte_input.readUint16();
		if (shapeVersion < 2) {
			obj.startColor = this.rgba();
			obj.endColor = this.rgba();
		} else {
			// MorphLineStyle2 in DefineMorphShape2
			obj.startCapStyle = byte_input.readUB(2);
			obj.joinStyle = byte_input.readUB(2);
			obj.hasFill = byte_input.readUB(1);
			obj.noHScale = byte_input.readUB(1);
			obj.noVScale = byte_input.readUB(1);
			obj.pixelHinting = byte_input.readUB(1);
			byte_input.readUB(5); // Reserved
			obj.noClose = byte_input.readUB(1);
			obj.endCapStyle = byte_input.readUB(2);
			if (obj.joinStyle === 2) obj.miterLimitFactor = byte_input.readFixed8();
			if (obj.hasFill) {
				obj.fillType = this.morphFillStyle();
			} else {
				obj.startColor = this.rgba();
				obj.endColor = this.rgba();
			}
		}
		return obj;
	};
	SwfInput.prototype.morphShapeWithStyle = function (shapeVersion, t) {
		const byte_input = this.input;
		var numBits = byte_input.readUint8();
		var NumFillBits = numBits >> 4;
		var NumLineBits = numBits & 0b1111;
		// NumFillBits and NumLineBits are written as 0 for the end shape.
		if (t) (NumFillBits = 0), (NumLineBits = 0);
		var ShapeRecords = this.shapeRecords(shapeVersion, {
			fillBits: NumFillBits,
			lineBits: NumLineBits,
		});
		return ShapeRecords;
	};
	//////// Font Text ////////
	SwfInput.prototype.getTextRecords = function (ver, GlyphBits, AdvanceBits) {
		const byte_input = this.input;
		var array = [];
		while (true) {
			var flags = byte_input.readUint8();
			if (flags == 0) break;
			const obj = {};
			if (flags & 0b1000) obj.fontId = byte_input.readUint16();
			if (flags & 0b100) obj.textColor = ver === 1 ? this.rgb() : this.rgba();
			if (flags & 0b1) obj.XOffset = byte_input.readInt16();
			if (flags & 0b10) obj.YOffset = byte_input.readInt16();
			if (flags & 0b1000) obj.textHeight = byte_input.readUint16();
			obj.glyphEntries = this.getGlyphEntries(GlyphBits, AdvanceBits);
			array.push(obj);
		}
		return array;
	};
	SwfInput.prototype.getGlyphEntries = function (GlyphBits, AdvanceBits) {
		// TODO(Herschel): font_id and height are tied together. Merge them into a struct?
		const byte_input = this.input;
		var count = byte_input.readUint8();
		var array = [];
		while (count--)
			array.push({
				index: byte_input.readUB(GlyphBits),
				advance: byte_input.readSB(AdvanceBits),
			});
		return array;
	};
	SwfInput.prototype.buttonRecords = function (ver) {
		var records = [];
		const byte_input = this.input;
		while (true) {
			var flags = byte_input.readUint8();
			if (flags == 0) break;
			const obj = {};
			obj.buttonStateUp = flags & 1;
			obj.buttonStateOver = (flags >>> 1) & 1;
			obj.buttonStateDown = (flags >>> 2) & 1;
			obj.buttonStateHitTest = (flags >>> 3) & 1;
			obj.characterId = byte_input.readUint16();
			obj.depth = byte_input.readUint16();
			obj.matrix = this.matrix();
			if (ver == 2) obj.colorTransform = this.colorTransform(true);
			if (flags & 16) obj.filters = this.getFilterList();
			if (flags & 32) obj.blendMode = byte_input.readUint8();
			records.push(obj);
		}
		return records;
	};
	SwfInput.prototype.buttonActions = function (endOffset) {
		const byte_input = this.input;
		var results = [];
		while (true) {
			const obj = {};
			var condActionSize = byte_input.readUint16();
			var flags = byte_input.readUint16();
			obj.condIdleToOverUp = flags & 1;
			obj.condOverUpToIdle = (flags >>> 1) & 1;
			obj.condOverUpToOverDown = (flags >>> 2) & 1;
			obj.condOverDownToOverUp = (flags >>> 3) & 1;
			obj.condOverDownToOutDown = (flags >>> 4) & 1;
			obj.condOutDownToOverDown = (flags >>> 5) & 1;
			obj.condOutDownToIdle = (flags >>> 6) & 1;
			obj.condIdleToOverDown = (flags >>> 7) & 1;
			obj.condOverDownToIdle = (flags >>> 8) & 1;
			obj.condKeyPress = flags >> 9;
			byte_input.byteAlign();
			if (condActionSize >= 4) {
				obj.actionScript = this.parseAction(
					byte_input.readBytes(condActionSize - 4)
				);
			} else if (condActionSize == 0) {
				// Last action, read to end.
				obj.actionScript = this.parseAction(
					byte_input.readBytes(endOffset - byte_input.position)
				);
			} else {
				// Some SWFs have phantom action records with an invalid length.
				// See 401799_pre_Scene_1.swf
				// TODO: How does Flash handle this?
			}
			results.push(obj);
			if (condActionSize == 0) break;
			if (byte_input.position > endOffset) break;
		}
		return results;
	};
	SwfInput.prototype.parseSoundFormat = function () {
		const byte_input = this.input;
		const obj = {};
		var frags = byte_input.readUint8();
		obj.compression =
			SwfTypes.sound.compression[frags >> 4] ||
			this.emitMessage("Invalid audio format", "error");
		obj.sampleRate = SwfTypes.sound.sampleRate[(frags & 0b1100) >> 2];
		obj.is16Bit = frags & 0b10;
		obj.isStereo = frags & 0b1;
		return obj;
	};
	SwfInput.prototype.parseClipActions = function (startOffset, length) {
		const byte_input = this.input;
		byte_input.readUint16();
		var allEventFlags = this.parseClipEventFlags();
		var endLength = startOffset + length;
		var actionRecords = [];
		while (byte_input.position < endLength) {
			var clipActionRecord = this.parseClipActionRecord(endLength);
			actionRecords.push(clipActionRecord);
			if (endLength <= byte_input.position) break;
			var endFlag =
				this._swfVersion <= 5
					? byte_input.readUint16()
					: byte_input.readUint32();
			if (!endFlag) break;
			if (this._swfVersion <= 5) byte_input.position -= 2;
			else byte_input.position -= 4;
			if (clipActionRecord.keyCode) byte_input.position -= 1;
		}
		return { allEventFlags, actionRecords };
	};
	SwfInput.prototype.parseClipActionRecord = function (endLength) {
		const byte_input = this.input;
		const obj = {};
		var eventFlags = this.parseClipEventFlags();
		if (endLength > byte_input.position) {
			var ActionRecordSize = byte_input.readUint32();
			if (eventFlags.keyPress) obj.keyCode = byte_input.readUint8();
			obj.eventFlags = eventFlags;
			obj.actions = this.parseAction(byte_input.readBytes(ActionRecordSize));
		}
		return obj;
	};
	SwfInput.prototype.parseClipEventFlags = function () {
		const obj = {};
		const byte_input = this.input;
		obj.keyUp = byte_input.readUB(1);
		obj.keyDown = byte_input.readUB(1);
		obj.mouseUp = byte_input.readUB(1);
		obj.mouseDown = byte_input.readUB(1);
		obj.mouseMove = byte_input.readUB(1);
		obj.unload = byte_input.readUB(1);
		obj.enterFrame = byte_input.readUB(1);
		obj.load = byte_input.readUB(1);
		if (this._swfVersion >= 6) {
			obj.dragOver = byte_input.readUB(1);
			obj.rollOut = byte_input.readUB(1);
			obj.rollOver = byte_input.readUB(1);
			obj.releaseOutside = byte_input.readUB(1);
			obj.release = byte_input.readUB(1);
			obj.press = byte_input.readUB(1);
			obj.initialize = byte_input.readUB(1);
		}
		obj.data = byte_input.readUB(1);
		if (this._swfVersion >= 6) {
			byte_input.readUB(5);
			obj.construct = byte_input.readUB(1);
			obj.keyPress = byte_input.readUB(1);
			obj.dragOut = byte_input.readUB(1);
			byte_input.readUB(8);
		}
		byte_input.byteAlign();
		return obj;
	};
	SwfInput.prototype.getFilterList = function () {
		const byte_input = this.input;
		const result = [];
		var numberOfFilters = byte_input.readUint8();
		while (numberOfFilters--) {
			result.push(this.getFilter());
		}
		return result;
	};
	SwfInput.prototype.getFilter = function () {
		const byte_input = this.input;
		var filterId = byte_input.readUint8();
		var filter;
		switch (filterId) {
			case 0:
				filter = this.dropShadowFilter();
				break;
			case 1:
				filter = this.blurFilter();
				break;
			case 2:
				filter = this.glowFilter();
				break;
			case 3:
				filter = this.bevelFilter();
				break;
			case 4:
				filter = this.gradientGlowFilter();
				break;
			case 5:
				filter = this.convolutionFilter();
				break;
			case 6:
				filter = this.colorMatrixFilter();
				break;
			case 7:
				filter = this.gradientBevelFilter();
				break;
			default:
				this.emitMessage("Invalid filter type: " + filterId, "error");
		}
		return { filterId, filter };
	};
	SwfInput.prototype.dropShadowFilter = function () {
		const byte_input = this.input;
		var rgba = this.rgba();
		var alpha = rgba[3];
		var color = (rgba[0] << 16) | (rgba[1] << 8) | rgba[2];
		var blurX = byte_input.readFixed16();
		var blurY = byte_input.readFixed16();
		var angle = (byte_input.readFixed16() * 180) / Math.PI;
		var distance = byte_input.readFixed16();
		var strength = byte_input.readFloat16() / 256;
		var inner = byte_input.readUB(1) ? true : false;
		var knockout = byte_input.readUB(1) ? true : false;
		var hideObject = byte_input.readUB(1) ? false : true;
		var quality = byte_input.readUB(5);
		if (!strength) return null;
		return {
			distance,
			angle,
			color,
			alpha,
			blurX,
			blurY,
			strength,
			quality,
			inner,
			knockout,
			hideObject,
		};
	};
	SwfInput.prototype.blurFilter = function () {
		const byte_input = this.input;
		var blurX = byte_input.readFixed16();
		var blurY = byte_input.readFixed16();
		var quality = byte_input.readUB(5);
		byte_input.readUB(3);
		return { blurX, blurY, quality };
	};
	SwfInput.prototype.glowFilter = function () {
		const byte_input = this.input;
		var rgba = this.rgba();
		var alpha = rgba[3];
		var color = (rgba[0] << 16) | (rgba[1] << 8) | rgba[2];
		var blurX = byte_input.readFixed16();
		var blurY = byte_input.readFixed16();
		var strength = byte_input.readFloat16() / 256;
		var inner = byte_input.readUB(1) ? true : false;
		var knockout = byte_input.readUB(1) ? true : false;
		byte_input.readUB(1);
		var quality = byte_input.readUB(5);
		if (!strength) return null;
		return { color, alpha, blurX, blurY, strength, quality, inner, knockout };
	};
	SwfInput.prototype.bevelFilter = function () {
		const byte_input = this.input;
		var rgba;
		rgba = this.rgba();
		var highlightAlpha = rgba[3];
		var highlightColor = (rgba[0] << 16) | (rgba[1] << 8) | rgba[2];
		rgba = this.rgba();
		var shadowAlpha = rgba[3];
		var shadowColor = (rgba[0] << 16) | (rgba[1] << 8) | rgba[2];
		var blurX = byte_input.readFixed16();
		var blurY = byte_input.readFixed16();
		var angle = (byte_input.readFixed16() * 180) / Math.PI;
		var distance = byte_input.readFixed16();
		var strength = byte_input.readFloat16() / 256;
		var inner = byte_input.readUB(1) ? true : false;
		var knockout = byte_input.readUB(1) ? true : false;
		byte_input.readUB(1);
		var OnTop = byte_input.readUB(1);
		var quality = byte_input.readUB(4);
		var type = "inner";
		if (!inner) {
			if (OnTop) type = "full";
			else type = "outer";
		}
		if (!strength) return null;
		return {
			distance,
			angle,
			highlightColor,
			highlightAlpha,
			shadowColor,
			shadowAlpha,
			blurX,
			blurY,
			strength,
			quality,
			type,
			knockout,
		};
	};
	SwfInput.prototype.gradientGlowFilter = function () {
		const byte_input = this.input;
		var i;
		var numColors = byte_input.readUint8();
		var colors = [];
		var alphas = [];
		for (i = 0; i < numColors; i++) {
			var rgba = this.rgba();
			alphas[alphas.length] = rgba[3];
			colors[colors.length] = (rgba[0] << 16) | (rgba[1] << 8) | rgba[2];
		}
		var ratios = [];
		for (i = 0; i < numColors; i++)
			ratios[ratios.length] = byte_input.readUint8();
		var blurX = byte_input.readFixed16();
		var blurY = byte_input.readFixed16();
		var angle = (byte_input.readFixed16() * 180) / Math.PI;
		var distance = byte_input.readFixed16();
		var strength = byte_input.readFloat16() / 256;
		var inner = byte_input.readUB(1) ? true : false;
		var knockout = byte_input.readUB(1) ? true : false;
		byte_input.readUB(1);
		var onTop = byte_input.readUB(1);
		var quality = byte_input.readUB(4);
		var type = "inner";
		if (!inner) {
			if (onTop) {
				type = "full";
			} else {
				type = "outer";
			}
		}
		if (!strength) return null;
		return {
			distance,
			angle,
			colors,
			alphas,
			ratios,
			blurX,
			blurY,
			strength,
			quality,
			type,
			knockout,
		};
	};
	SwfInput.prototype.convolutionFilter = function () {
		const byte_input = this.input;
		const obj = {};
		obj.matrixX = byte_input.readUint8();
		obj.matrixY = byte_input.readUint8();
		obj.divisor = byte_input.readFloat16() | byte_input.readFloat16();
		obj.bias = byte_input.readFloat16() | byte_input.readFloat16();
		var count = obj.matrixX * obj.matrixY;
		var matrixArr = [];
		while (count--) matrixArr.push(byte_input.readUint32());
		obj.defaultColor = this.rgba();
		byte_input.readUB(6);
		obj.clamp = byte_input.readUB(1);
		obj.preserveAlpha = byte_input.readUB(1);
		return obj;
	};
	SwfInput.prototype.gradientBevelFilter = function () {
		const byte_input = this.input;
		var NumColors = byte_input.readUint8();
		var i;
		var colors = [];
		var alphas = [];
		for (i = 0; i < NumColors; i++) {
			var rgba = this.rgba();
			alphas.push(rgba[3]);
			colors.push((rgba[0] << 16) | (rgba[1] << 8) | rgba[2]);
		}
		var ratios = [];
		for (i = 0; i < NumColors; i++)
			ratios[ratios.length] = byte_input.readUint8();
		var blurX = byte_input.readFixed16();
		var blurY = byte_input.readFixed16();
		var angle = (byte_input.readFixed16() * 180) / Math.PI;
		var distance = byte_input.readFixed16();
		var strength = byte_input.readFloat16() / 256;
		var inner = byte_input.readUB(1) ? true : false;
		var knockout = byte_input.readUB(1) ? true : false;
		byte_input.readUB(1);
		var OnTop = byte_input.readUB(1);
		var quality = byte_input.readUB(4);
		var type = "inner";
		if (!inner) {
			if (OnTop) type = "full";
			else type = "outer";
		}
		if (!strength) {
			return null;
		}
		return {
			distance,
			angle,
			colors,
			alphas,
			ratios,
			blurX,
			blurY,
			strength,
			quality,
			type,
			knockout,
		};
	};
	SwfInput.prototype.colorMatrixFilter = function () {
		const byte_input = this.input;
		var matrixArr = [];
		for (var i = 0; i < 20; i++) matrixArr.push(byte_input.readUint32());
		return matrixArr;
	};
	SwfInput.prototype.parseSoundInfo = function () {
		const obj = {};
		const byte_input = this.input;
		var flags = byte_input.readUint8();
		switch ((flags >> 4) & 0b11) {
			case 0: // Event
				obj.event = "event";
				break;
			case 1: // Start
				obj.event = "start";
				break;
			case 2: // Stop
				obj.event = "stop";
				break;
		}
		if (flags & 0b1) obj.inSample = byte_input.readUint32();
		if (flags & 0b10) obj.outSample = byte_input.readUint32();
		if (flags & 0b100) obj.numLoops = byte_input.readUint16();
		if (flags & 0b1000) {
			var count = byte_input.readUint8();
			var envelope = [];
			while (count--) {
				envelope.push({
					sample: byte_input.readUint32(),
					leftVolume: byte_input.readUint16(),
					rightVolume: byte_input.readUint16(),
				});
			}
			obj.envelope = envelope;
		}
		return obj;
	};
	SwfInput.prototype.parseAction = function (data) {
		return data;
	};
	SwfInput.prototype.parseABC = function (data) {
		return data;
	};
	//////// Define ////////
	SwfInput.prototype.parseDefineButton = function (ver, length) {
		const byte_input = this.input;
		const obj = {};
		var endOffset = byte_input.position + length;
		obj.id = byte_input.readUint16();
		var ActionOffset = 0;
		if (ver == 2) {
			obj.flag = byte_input.readUint8();
			obj.trackAsMenu = obj.flag & 0b1;
			ActionOffset = byte_input.readUint16();
		}
		obj.records = this.buttonRecords(ver);
		byte_input.byteAlign();
		if (ver === 1) {
			obj.actions = this.parseAction(
				byte_input.readBytes(endOffset - byte_input.position)
			);
		} else {
			if (ActionOffset > 0) {
				obj.actions = this.buttonActions(endOffset);
			}
		}
		byte_input.byteAlign();
		return obj;
	};
	SwfInput.prototype.parseDefineButtonSound = function () {
		const byte_input = this.input;
		const obj = {};
		obj.buttonId = byte_input.readUint16();
	
		// Some SWFs (third-party soundboard creator?) create SWFs with a malformed
		// DefineButtonSound tag that has fewer than all 4 sound IDs.
		for (var i = 0; i < 4; i++) {
			var soundId = byte_input.readUint16();
			if (soundId) {
				var soundInfo = this.parseSoundInfo();
				switch (i) {
					case 0:
						obj.buttonStateUpSoundInfo = soundInfo;
						obj.buttonStateUpSoundId = soundId;
						break;
					case 1:
						obj.buttonStateOverSoundInfo = soundInfo;
						obj.buttonStateOverSoundId = soundId;
						break;
					case 2:
						obj.buttonStateDownSoundInfo = soundInfo;
						obj.buttonStateDownSoundId = soundId;
						break;
					case 3:
						obj.buttonStateHitTestSoundInfo = soundInfo;
						obj.buttonStateHitTestSoundId = soundId;
						break;
				}
			}
		}
		return obj;
	};
	SwfInput.prototype.parseDefineFont1 = function (length) {
		const byte_input = this.input;
		const obj = {};
		obj.version = 1;
		var endOffset = byte_input.position + length;
		var i;
		obj.id = byte_input.readUint16();
		var offset = byte_input.position;
		var numGlyphs = byte_input.readUint16();
		var offsetTable = [];
		offsetTable.push(numGlyphs);
		numGlyphs /= 2;
		numGlyphs--;
		for (i = numGlyphs; i--; ) offsetTable.push(byte_input.readUint16());
		numGlyphs++;
		var glyphs = [];
		for (i = 0; i < numGlyphs; i++) {
			byte_input.setOffset(offset + offsetTable[i], 0);
			var numBits = byte_input.readUint8();
			glyphs.push(
				this.shapeRecords(1, {
					fillBits: numBits >> 4,
					lineBits: numBits & 0b1111,
				})
			);
		}
		obj.glyphs = glyphs;
		byte_input.position = endOffset;
		byte_input.bit_offset = 0;
		return obj;
	};
	SwfInput.prototype.parseDefineFont2 = function (ver, length) {
		const byte_input = this.input;
		var startOffset = byte_input.position;
		const obj = {};
		obj.version = ver;
		obj.id = byte_input.readUint16();
		var i = 0;
		var fontFlags = byte_input.readUint8();
		obj.isBold = fontFlags & 1;
		obj.isItalic = (fontFlags >>> 1) & 1;
		var isWideCodes = (fontFlags >>> 2) & 1;
		obj.isWideCodes = isWideCodes;
		var isWideOffsets = (fontFlags >>> 3) & 1;
		obj.isWideOffsets = isWideOffsets;
		obj.isANSI = (fontFlags >>> 4) & 1;
		obj.isSmallText = (fontFlags >>> 5) & 1;
		obj.isShiftJIS = (fontFlags >>> 6) & 1;
		var hasLayout = (fontFlags >>> 7) & 1;
		obj.languageCode = byte_input.readUint8();
		obj.fontNameData = byte_input.readStringWithLength();
		var numGlyphs = byte_input.readUint16();
		obj.numGlyphs = numGlyphs;
		if (numGlyphs == 0) {
			if (isWideOffsets) byte_input.readUint32();
			else byte_input.readUint16();
		} else {
			var offset = byte_input.position;
			var OffsetTable = [];
			if (isWideOffsets) {
				for (i = numGlyphs; i--; ) {
					OffsetTable[OffsetTable.length] = byte_input.readUint32();
				}
			} else {
				for (i = numGlyphs; i--; ) {
					OffsetTable[OffsetTable.length] = byte_input.readUint16();
				}
			}
			var codeTableOffset;
			if (isWideOffsets) {
				codeTableOffset = byte_input.readUint32();
			} else {
				codeTableOffset = byte_input.readUint16();
			}
			var glyphShapeTable = [];
			for (i = 0; i < numGlyphs; i++) {
				byte_input.setOffset(offset + OffsetTable[i], 0);
				var availableBytes;
				if (i < numGlyphs - 1) {
					availableBytes = OffsetTable[i + 1] - OffsetTable[i];
				} else {
					availableBytes = codeTableOffset - OffsetTable[i];
				}
				if (availableBytes == 0) continue;
				var numBits = byte_input.readUint8();
				if (availableBytes == 1) continue;
				var numFillBits = numBits >> 4;
				var numLineBits = numBits & 0b1111;
				glyphShapeTable.push(
					this.shapeRecords(1, {
						fillBits: numFillBits,
						lineBits: numLineBits,
					})
				);
			}
			obj.glyphs = glyphShapeTable;
			byte_input.setOffset(offset + codeTableOffset, 0);
			var CodeTable = [];
			if (isWideCodes) {
				for (i = numGlyphs; i--; ) {
					CodeTable.push(byte_input.readUint16());
				}
			} else {
				for (i = numGlyphs; i--; ) {
					CodeTable.push(byte_input.readUint8());
				}
			}
			obj.codeTables = CodeTable;
		}
		if (hasLayout) {
			obj.layout = {};
			obj.layout.ascent = byte_input.readUint16();
			obj.layout.descent = byte_input.readUint16();
			obj.layout.leading = byte_input.readInt16();
			var advanceTable = [];
			for (i = numGlyphs; i--; ) {
				advanceTable.push(byte_input.readInt16());
			}
			obj.layout.advanceTable = advanceTable;
			var boundsTable = [];
			if (byte_input.position - startOffset < length) {
				for (i = numGlyphs; i--; ) {
					boundsTable.push(this.rect());
				}
				byte_input.byteAlign();
			}
			obj.layout.boundsTable = boundsTable;
			var kernings = [];
			if (byte_input.position - startOffset < length) {
				var kerningCount = byte_input.readUint16();
				for (i = kerningCount; i--; ) {
					var kerningCode1 = isWideCodes
						? byte_input.readUint16()
						: byte_input.readUint8();
					var kerningCode2 = isWideCodes
						? byte_input.readUint16()
						: byte_input.readUint8();
					var kerningAdjustment = byte_input.readInt16();
					kernings.push({
						leftCode: kerningCode1,
						rightCode: kerningCode2,
						adjustment: kerningAdjustment,
					});
				}
			}
			obj.kernings = kernings;
		}
		return obj;
	};
	SwfInput.prototype.parseDefineFont4 = function (length) {
		const byte_input = this.input;
		var startOffset = byte_input.position;
		const obj = {};
		obj.version = 4;
		obj.id = byte_input.readUint16();
		var flags = byte_input.readUint8();
		obj.name = byte_input.readStringWithUntil();
		if (flags & 0b100) {
			obj.data = byte_input.readBytes(
				length - (byte_input.position - startOffset)
			);
		} else {
			var e = length - (byte_input.position - startOffset);
			byte_input.position += e;
		}
		obj.isItalic = flags & 0b10;
		obj.isBold = flags & 0b1;
		return obj;
	};
	SwfInput.prototype.parseDefineFontInfo = function (ver, length) {
		const byte_input = this.input;
		var endOffset = byte_input.position + length;
		const obj = {};
		obj.id = byte_input.readUint16();
		obj.version = ver;
		obj.fontNameData = byte_input.readStringWithLength();
		var flags = byte_input.readUint8();
		obj.isWideCodes = flags & 1;
		obj.isBold = (flags >>> 1) & 1;
		obj.isItalic = (flags >>> 2) & 1;
		obj.isShiftJIS = (flags >>> 3) & 1;
		obj.isANSI = (flags >>> 4) & 1;
		obj.isSmallText = (flags >>> 5) & 1;
		byte_input.byteAlign();
		if (ver === 2) obj.languageCode = byte_input.readUint8();
		var codeTable = [];
		var tLen = endOffset - byte_input.position;
		if (obj.isWideCodes) {
			while (tLen > 1) {
				codeTable.push(byte_input.readUint16());
				tLen -= 2;
			}
		} else {
			while (tLen > 0) {
				codeTable.push(byte_input.readUint8());
				tLen--;
			}
		}
		obj.codeTable = codeTable;
		return obj;
	};
	SwfInput.prototype.parseDefineEditText = function () {
		const byte_input = this.input;
		const obj = {};
		obj.id = byte_input.readUint16();
		obj.bounds = this.rect();
		var flag1 = byte_input.readUint16();
		var hasFont = flag1 & 1;
		var hasMaxLength = (flag1 >>> 1) & 1;
		var hasTextColor = (flag1 >>> 2) & 1;
		var isReadOnly = (flag1 >>> 3) & 1;
		var isPassword = (flag1 >>> 4) & 1;
		var isMultiline = (flag1 >>> 5) & 1;
		var isWordWrap = (flag1 >>> 6) & 1;
		var hasInitialText = (flag1 >>> 7) & 1;
		var outlines = (flag1 >>> 8) & 1;
		var HTML = (flag1 >>> 9) & 1;
		var wasStatic = (flag1 >>> 10) & 1;
		var border = (flag1 >>> 11) & 1;
		var noSelect = (flag1 >>> 12) & 1;
		var hasLayout = (flag1 >>> 13) & 1;
		var autoSize = (flag1 >>> 14) & 1;
		var hasFontClass = (flag1 >>> 15) & 1;
		(obj.isReadOnly = isReadOnly),
			(obj.isPassword = isPassword),
			(obj.isMultiline = isMultiline),
			(obj.isWordWrap = isWordWrap),
			(obj.outlines = outlines),
			(obj.HTML = HTML),
			(obj.wasStatic = wasStatic),
			(obj.border = border),
			(obj.noSelect = noSelect),
			(obj.autoSize = autoSize);
		if (hasFont) obj.fontID = byte_input.readUint16();
		if (hasFontClass) obj.fontClass = byte_input.readStringWithUntil();
		if (hasFont && !hasFontClass) obj.fontHeight = byte_input.readUint16();
		if (hasTextColor) obj.textColor = this.rgba();
		if (hasMaxLength) obj.maxLength = byte_input.readUint16();
		if (hasLayout) {
			obj.layout = {};
			obj.layout.align = byte_input.readUint8();
			obj.layout.leftMargin = byte_input.readUint16();
			obj.layout.rightMargin = byte_input.readUint16();
			obj.layout.indent = byte_input.readUint16();
			obj.layout.leading = byte_input.readInt16();
		}
		obj.variableName = byte_input.readStringWithUntil();
		if (hasInitialText) obj.initialText = byte_input.readStringWithUntil();
		return obj;
	};
	SwfInput.prototype.parseDefineSprite = function () {
		const obj = {};
		const byte_input = this.input;
		obj.id = byte_input.readUint16();
		obj.numFrames = byte_input.readUint16();
		obj.tags = this.parseTags();
		return obj;
	};
	SwfInput.prototype.parseDefineShape = function (version) {
		const byte_input = this.input;
		const obj = {};
		obj.id = byte_input.readUint16();
		obj.bounds = this.rect();
		obj.version = version;
		if (version >= 4) {
			obj.edgeBounds = this.rect();
			var flags = byte_input.readUint8();
			obj.scalingStrokes = flags & 1;
			obj.nonScalingStrokes = (flags >>> 1) & 1;
			obj.fillWindingRule = (flags >>> 2) & 1;
		}
		obj.fillStyles = this.fillStyleArray(version);
		obj.lineStyles = this.lineStyleArray(version);
		var numBits = byte_input.readUint8();
		var numFillBits = numBits >> 4;
		var numLineBits = numBits & 0b1111;
		obj.shapeRecords = this.shapeRecords(version, {
			fillBits: numFillBits,
			lineBits: numLineBits,
		});
		obj.numFillBits = numFillBits;
		obj.numLineBits = numLineBits;
		return obj;
	};
	SwfInput.prototype.parseDefineSound = function (length) {
		const obj = {};
		const byte_input = this.input;
		var startOffset = byte_input.position;
		obj.id = byte_input.readUint16();
		obj.format = this.parseSoundFormat();
		obj.numSamples = byte_input.readUint32();
		var sub = byte_input.position - startOffset;
		var dataLength = length - sub;
		obj.data = byte_input.readBytes(dataLength);
		return obj;
	};
	SwfInput.prototype.parseDefineText = function (ver) {
		const byte_input = this.input;
		const obj = {};
		obj.id = byte_input.readUint16();
		obj.bounds = this.rect();
		obj.matrix = this.matrix();
		var GlyphBits = byte_input.readUint8();
		var AdvanceBits = byte_input.readUint8();
		obj.records = this.getTextRecords(ver, GlyphBits, AdvanceBits);
		return obj;
	};
	SwfInput.prototype.parseDefineBinaryData = function (length) {
		const byte_input = this.input;
		const obj = {};
		obj.id = byte_input.readUint16();
		byte_input.readUint32();
		obj.data = byte_input.readBytes(length - 6);
		return obj;
	};
	SwfInput.prototype.parseDefineScalingGrid = function () {
		const byte_input = this.input;
		const obj = {};
		obj.characterId = byte_input.readUint16();
		obj.splitter = this.rect();
		byte_input.byteAlign();
		return obj;
	};
	SwfInput.prototype.parseDefineSceneAndFrameLabelData = function () {
		const byte_input = this.input;
		const obj = {};
		var sceneCount = byte_input.readEncodedU32();
		obj.sceneInfo = [];
		while (sceneCount--) {
			obj.sceneInfo.push({
				offset: byte_input.readEncodedU32(),
				name: byte_input.readStringWithUntil(),
			});
		}
		var frameLabelCount = byte_input.readEncodedU32();
		obj.frameInfo = [];
		while (frameLabelCount--) {
			obj.frameInfo.push({
				num: byte_input.readEncodedU32(),
				label: byte_input.readStringWithUntil(),
			});
		}
		return obj;
	};
	SwfInput.prototype.parseDefineVideoStream = function () {
		const byte_input = this.input;
		const obj = {};
		obj.id = byte_input.readUint16();
		obj.numFrames = byte_input.readUint16();
		obj.width = byte_input.readUint16();
		obj.height = byte_input.readUint16();
		// TODO(Herschel): Check SWF version.
		var flags = byte_input.readUint8();
		obj.codec =
			SwfTypes.video.codec[byte_input.readUint8()] ||
			this.emitMessage("Invalid video codec.", "error");
		obj.deblocking =
			SwfTypes.video.deblocking[(flags >> 1) & 0b111] ||
			this.emitMessage("Invalid video deblocking value.", "error");
		obj.isSmoothed = flags & 0b1;
		return obj;
	};
	SwfInput.prototype.parseDefineBitsLossLess = function (ver, length) {
		const obj = {};
		const byte_input = this.input;
		var startOffset = byte_input.position;
		obj.id = byte_input.readUint16();
		obj.version = ver;
		var format = byte_input.readUint8();
		obj.width = byte_input.readUint16();
		obj.height = byte_input.readUint16();
		switch (format) {
			case 3: // ColorMap8
				obj.numColors = byte_input.readUint8();
				break;
			case 4: // Rgb15
			case 5: // Rgb32
				break;
			default:
				this.emitMessage("Invalid bitmap format: " + format, "error");
		}
		var sub = byte_input.position - startOffset;
		obj.data = byte_input.readBytes(length - sub);
		obj.format = format;
		return obj;
	};
	SwfInput.prototype.parseDefineFontName = function () {
		const obj = {};
		const byte_input = this.input;
		obj.id = byte_input.readUint16();
		obj.name = byte_input.readStringWithUntil();
		obj.copyrightInfo = byte_input.readStringWithUntil();
		return obj;
	};
	SwfInput.prototype.parseDefineBits = function (ver, length) {
		const obj = {};
		const byte_input = this.input;
		var startOffset = byte_input.position;
		obj.id = byte_input.readUint16();
		if (ver <= 2) {
			obj.data = byte_input.readBytes(length - 2);
		} else {
			var dataSize = byte_input.readUint32();
			var deblocking = null;
			if (ver >= 4) deblocking = byte_input.readUint16();
			var data = byte_input.readBytes(dataSize);
			var sub = byte_input.position - startOffset;
			var alphaData = byte_input.readBytes(length - sub);
			obj.data = data;
			obj.alphaData = alphaData;
			obj.deblocking = deblocking;
		}
		return obj;
	};
	SwfInput.prototype.parseDefineButtonCxform = function (length) {
		const byte_input = this.input;
		const startOffset = byte_input.position;
		const obj = {};
		// SWF19 is incorrect here. You can have >1 color transforms in this tag. They apply
		// to the characters in a button in sequence.
		obj.id = byte_input.readUint16();
		var colorTransforms = [];
	
		// Read all color transforms.
		while (byte_input.position - startOffset < length) {
			colorTransforms.push(this.colorTransform(false));
			byte_input.byteAlign();
		}
		obj.colorTransforms = colorTransforms;
		return obj;
	};
	SwfInput.prototype.parseDefineMorphShape = function (ver) {
		const byte_input = this.input;
		const obj = {};
		obj.id = byte_input.readUint16();
		obj.startBounds = this.rect();
		obj.endBounds = this.rect();
		if (ver == 2) {
			obj.startEdgeBounds = this.rect();
			obj.endEdgeBounds = this.rect();
			var flags = byte_input.readUint8();
			obj.isScalingStrokes = flags & 1;
			obj.isNonScalingStrokes = (flags >>> 1) & 1;
		}
		byte_input.readUint32(); // Offset to EndEdges.
		obj.morphFillStyles = this.morphFillStyleArray(ver);
		obj.morphLineStyles = this.morphLineStyleArray(ver);
	
		// TODO(Herschel): Add read_shape
		obj.startEdges = this.morphShapeWithStyle(ver, false);
		obj.endEdges = this.morphShapeWithStyle(ver, true);
		return obj;
	};
	SwfInput.prototype.parseDefineFontAlignZones = function (length) {
		const byte_input = this.input;
		var tag = {};
		var startOffset = byte_input.position;
		tag.id = byte_input.readUint16();
		tag.thickness = byte_input.readUint8();
		var zones = [];
		while (byte_input.position < startOffset + length) {
			byte_input.readUint8(); // Always 2.
			zones.push({
				left: byte_input.readInt16(),
				width: byte_input.readInt16(),
				bottom: byte_input.readInt16(),
				height: byte_input.readInt16(),
			});
			byte_input.readUint8(); // Always 0b000000_11 (2 dimensions).
		}
		tag.zones = zones;
		return tag;
	};
	SwfInput.prototype.parsePlaceObject = function (ver, length) {
		const byte_input = this.input;
		const obj = {};
		var startOffset = byte_input.position;
		obj.version = ver;
		if (ver === 1) {
			obj.isMove = false;
			obj.characterId = byte_input.readUint16();
			obj.depth = byte_input.readUint16();
			obj.matrix = this.matrix();
			byte_input.byteAlign();
			if (byte_input.position - startOffset < length)
				obj.colorTransform = this.colorTransform();
		} else {
			var flags = ver >= 3 ? byte_input.readUint16() : byte_input.readUint8();
	
			obj.depth = byte_input.readUint16();
	
			var isMove = flags & 1;
			var hasCharacter = (flags >>> 1) & 1;
			var hasMatrix = (flags >>> 2) & 1;
			var hasColorTransform = (flags >>> 3) & 1;
			var hasRatio = (flags >>> 4) & 1;
			var hasName = (flags >>> 5) & 1;
			var hasClipDepth = (flags >>> 6) & 1;
			var hasClipActions = (flags >>> 7) & 1;
			// PlaceObject3
			var hasFilters = (flags >>> 8) & 1;
			var hasBlendMode = (flags >>> 9) & 1;
			var hasBitmapCache = (flags >>> 10) & 1;
			var hasClassName = (flags >>> 11) & 1;
			var hasImage = (flags >>> 12) & 1;
			var hasVisible = (flags >>> 13) & 1;
			var hasBackgroundColor = (flags >>> 14) & 1;
	
			// PlaceObject3
			// SWF19 p.40 incorrectly says class name if (HasClassNameFlag || (HasImage && HasCharacterID))
			// I think this should be if (HasClassNameFlag || (HasImage && !HasCharacterID)),
			// you use the class name only if a character ID isn't present.
			// But what is the case where we'd have an image without either HasCharacterID or HasClassName set?
			obj.hasImage = hasImage;
			if (hasClassName || (obj.hasImage && !hasCharacter))
				obj.className = byte_input.readStringWithUntil();
			obj.isMove = isMove;
			if (hasCharacter) obj.characterId = byte_input.readUint16();
			if (!obj.isMove && !hasCharacter)
				this.emitMessage("Invalid PlaceObject type", "error");
			if (hasMatrix) obj.matrix = this.matrix();
			if (hasColorTransform) obj.colorTransform = this.colorTransform(true);
			if (hasRatio) obj.ratio = byte_input.readUint16();
			if (hasName) obj.name = byte_input.readStringWithUntil();
			if (hasClipDepth) obj.clipDepth = byte_input.readUint16();
	
			// PlaceObject3
			if (hasFilters) obj.filters = this.getFilterList();
			if (hasBlendMode) obj.blendMode = byte_input.readUint8();
			if (hasBitmapCache) obj.bitmapCache = byte_input.readUint8();
			if (hasVisible) obj.visible = byte_input.readUint8();
			if (hasBackgroundColor) obj.backgroundColor = this.rgba();
			if (hasClipActions)
				obj.clipActions = this.parseClipActions(startOffset, length);
	
			// PlaceObject4
			if (ver === 4) {
				byte_input.byteAlign();
				obj.amfData = byte_input.readBytes(
					length - (byte_input.position - startOffset)
				);
			}
		}
		byte_input.byteAlign();
		return obj;
	};
	SwfInput.prototype.parseDoAction = function (length) {
		const byte_input = this.input;
		const obj = {};
		obj.action = this.parseAction(byte_input.readBytes(length));
		return obj;
	};
	SwfInput.prototype.parseDoInitAction = function (length) {
		const byte_input = this.input;
		const obj = {};
		obj.spriteId = byte_input.readUint16();
		obj.action = this.parseAction(byte_input.readBytes(length - 2));
		return obj;
	};
	SwfInput.prototype.parseDoABC = function (ver, length) {
		const byte_input = this.input;
		var startOffset = byte_input.position;
		const obj = {};
		obj.version = ver;
		if (ver == 2) {
			obj.flags = byte_input.readUint32();
			obj.lazyInitialize = obj.flags & 1;
			obj.name = byte_input.readStringWithUntil();
		}
		var offset = length - (byte_input.position - startOffset);
		obj.abc = this.parseABC(byte_input.readBytes(offset));
		return obj;
	};
	SwfInput.prototype.parseProductInfo = function () {
		const byte_input = this.input;
		const obj = {};
		obj.productID = byte_input.readUint32();
		obj.edition = byte_input.readUint32();
		obj.majorVersion = byte_input.readUint8();
		obj.minorVersion = byte_input.readUint8();
		obj.buildBumber = byte_input.readUint64();
		obj.compilationDate = byte_input.readUint64();
		return obj;
	};
	SwfInput.prototype.parseDebugID = function (length) {
		const byte_input = this.input;
		const obj = {};
		obj.debugId = byte_input.readUint8();
		byte_input.position--;
		byte_input.position += length;
		return obj;
	};
	SwfInput.prototype.parseNameCharacter = function () {
		const byte_input = this.input;
		const obj = {};
		obj.id = byte_input.readUint16();
		obj.name = byte_input.readStringWithUntil();
		return obj;
	};
	SwfInput.prototype.parseFileAttributes = function () {
		const byte_input = this.input;
		const obj = {};
		var flags = byte_input.readUint32();
		obj.useDirectBlit = (flags >> 6) & 1;
		obj.useGPU = (flags >> 5) & 1;
		obj.hasMetadata = (flags >> 4) & 1;
		obj.isActionScript3 = (flags >> 3) & 1;
		obj.useNetworkSandbox = (flags >> 0) & 1;
		return obj;
	};
	SwfInput.prototype.parseSymbolClass = function () {
		const byte_input = this.input;
		const obj = {};
		var symbols = [];
		var count = byte_input.readUint16();
		while (count--) {
			symbols.push({
				tagId: byte_input.readUint16(),
				path: byte_input.readStringWithUntil(),
			});
		}
		obj.symbols = symbols;
		return obj;
	};
	SwfInput.prototype.parseFrameLabel = function (length) {
		const byte_input = this.input;
		var startOffset = byte_input.position;
		const obj = {};
		obj.label = byte_input.readStringWithUntil();
		var isAnchor = false;
		if (this._swfVersion >= 6 && byte_input.position - startOffset !== length)
			isAnchor = byte_input.readUint8() != 0;
		obj.isAnchor = isAnchor;
		return obj;
	};
	SwfInput.prototype.parseRemoveObject = function (ver) {
		const byte_input = this.input;
		const obj = {};
		if (ver == 1) obj.characterId = byte_input.readUint16();
		obj.depth = byte_input.readUint16();
		return obj;
	};
	SwfInput.prototype.parseExportAssets = function () {
		const obj = {};
		const byte_input = this.input;
		var count = byte_input.readUint16();
		var packages = [];
		while (count--) {
			var id = byte_input.readUint16();
			var name = byte_input.readStringWithUntil();
			packages.push([id, name]);
		}
		obj.packages = packages;
		return obj;
	};
	SwfInput.prototype.parseImportAssets = function (ver) {
		const byte_input = this.input;
		const obj = {};
		var url = byte_input.readStringWithUntil();
		if (ver == 2) {
			byte_input.readUint8();
			byte_input.readUint8();
		}
		var num_imports = byte_input.readUint16();
		var imports = [];
		while (num_imports--) {
			imports.push({
				id: byte_input.readUint16(),
				name: byte_input.readStringWithUntil(),
			});
		}
		obj.url = url;
		obj.imports = imports;
		return obj;
	};
	SwfInput.prototype.parseStartSound = function (ver) {
		const byte_input = this.input;
		const obj = {};
		if (ver == 2) {
			obj.className = byte_input.readStringWithUntil();
		} else {
			obj.id = byte_input.readUint16();
		}
		obj.info = this.parseSoundInfo();
		return obj;
	};
	SwfInput.prototype.parseSoundStreamHead = function (ver) {
		const obj = {};
		const byte_input = this.input;
		obj.version = ver;
		obj.playback = this.parseSoundFormat();
		obj.stream = this.parseSoundFormat();
		obj.samplePerBlock = byte_input.readUint16();
		if (obj.stream.compression === "MP3")
			obj.latencySeek = byte_input.readInt16();
		byte_input.byteAlign();
		return obj;
	};
	SwfInput.prototype.parseSoundStreamBlock = function (length) {
		const byte_input = this.input;
		const obj = {};
		obj.compressed = byte_input.readBytes(length);
		return obj;
	};
	SwfInput.prototype.parseVideoFrame = function (length) {
		const byte_input = this.input;
		var startOffset = byte_input.position;
		const obj = {};
		obj.streamId = byte_input.readUint16();
		obj.frameNum = byte_input.readUint16();
		var sub = byte_input.position - startOffset;
		var dataLength = length - sub;
		obj.data = byte_input.readBytes(dataLength);
		return obj;
	};
	SwfInput.prototype.parseCSMTextSettings = function () {
		const obj = {};
		const byte_input = this.input;
		obj.id = byte_input.readUint16();
		var flags = byte_input.readUint8();
		obj.useAdvancedRendering = flags & 0b01000000;
		switch ((flags >> 3) & 0b11) {
			case 0:
				obj.gridFit = "none";
				break;
			case 1:
				obj.gridFit = "pixel";
				break;
			case 2:
				obj.gridFit = "subPixel";
				break;
			default:
				this.emitMessage("Invalid text grid fitting", "error");
		}
		obj.thickness = byte_input.readFloat32();
		obj.sharpness = byte_input.readFloat32();
		byte_input.readUint8();
		return obj;
	};

	const SwfMovie = function () {
		this._header = null;
		this.dataStream = null;
		this.url = null;
		this.loaderUrl = null;
		this.parameters = [];
		this.compressedLength = 0;
	};
	Object.defineProperties(SwfMovie.prototype, {
		header: {
			get: function () {
				return this._header.header;
			},
		},
		uncompressedLength: {
			get: function () {
				return this._header.uncompressedLength;
			},
		},
		stageSize: {
			get: function () {
				return this._header.header.stageSize;
			},
		},
		frameRate: {
			get: function () {
				return this._header.header.frameRate;
			},
		},
		numFrames: {
			get: function () {
				return this._header.header.numFrames;
			},
		},
		backgroundColor: {
			get: function () {
				return this._header.backgroundColor;
			},
		},
		version: {
			get: function () {
				return this._header.header.version;
			},
		},
		width: {
			get: function () {
				var stageSize = this.stageSize;
				return (stageSize.xMax - stageSize.xMin) / 20;
			},
		},
		height: {
			get: function () {
				var stageSize = this.stageSize;
				return (stageSize.yMax - stageSize.yMin) / 20;
			},
		},
	});
	/// Construct a movie based on the contents of the SWF datastream.
	SwfMovie.fromData = function (swfData, url, loaderUrl) {
		var swfBuf = SwfInput.decompressSwf(swfData);
		var movie = new SwfMovie();
		movie._header = swfBuf.header;
		movie.dataStream = swfBuf.dataStream;
		movie.compressedLength = swfData.byteLength;
		return movie;
	};
	SwfMovie.prototype.isActionScript3 = function () {
		return this._header.fileAttributes.isActionScript3;
	};
	const SwfSlice = function (movie) {
		this.movie = movie;
		this.start = 0;
		this.end = 0;
	};
	SwfSlice.from = function (movie) {
		var h = new SwfSlice(movie);
		h.start = 0;
		h.end = movie.dataStream.length;
		return h;
	};
	Object.defineProperties(SwfSlice.prototype, {
		length: {
			get: function () {
				return this.end - this.start;
			},
		},
	});
	SwfSlice.prototype.readFrom = function (from) {
		var b = this.movie.dataStream.from(this.start, this.end);
		b.position = from;
		var r = new SwfInput(b, this.movie.version);
		return r;
	};
	SwfSlice.prototype.resizeToReader = function (reader, size) {
		let outer_offset = this.start + reader.input.position;
		let new_start = outer_offset;
		let new_end = outer_offset + size;
		var g = new SwfSlice(this.movie);
		g.start = new_start;
		g.end = new_end;
		return g;
	};
	const decodeTags = function (reader, tagCallback) {
		while (reader.input.bytesAvailable > 0) {
			var { tagcode, length } = reader.parseTagCodeLength();
			var startO = reader.input.position;
			var c = tagCallback(reader, tagcode, length);
			var s = length - (reader.input.position - startO);
			reader.input.position += s;
			if (c == true) break;
		}
		return true;
	};

	const Glyph = function (shapeHandle) {
		this.shapeHandle = shapeHandle;
	};
	const GlyphSource = function () {
		this.glyphs = [];
		this.codePointToGlyph = [];
	};
	GlyphSource.prototype.addGlyphs = function (e) {
		var g = new Glyph(e);
		this.glyphs.push(g);
	};
	GlyphSource.prototype.getByIndex = function (i) {
		return this.glyphs[i];
	};
	
	const FlashFont = function () {
		this.glyphs = new GlyphSource();
		this.scale = 1024.0;
	};
	FlashFont.fromSwfTag = function (renderer, tag) {
		var f = new FlashFont();
		f.scale = tag.version >= 3 ? 20480 : 1024;
		f.initGlyphs(renderer, tag.glyphs);
		return f;
	};
	FlashFont.prototype.initGlyphs = function (renderer, glyphs) {
		if (glyphs) {
			for (var i = 0; i < glyphs.length; i++) {
				var result = shapeUtils.convertWithCacheCodes(glyphs[i]);
				const sh = renderer.registerShape(result);
				this.glyphs.addGlyphs(sh);
			}
		}
	};
	FlashFont.prototype.setAlignZones = function (alignZones) {
		this.alignZones = alignZones;
	};
	FlashFont.prototype.getGlyph = function (index) {
		return this.glyphs.getByIndex(index);
	};

	const getBlendMode = function (mode) {
		switch (mode) {
			case 0:
			case 1:
				return "normal";
			case 2:
				return "layer";
			case 3:
				return "multiply";
			case 4:
				return "screen";
			case 5:
				return "lighten";
			case 6:
				return "darken";
			case 7:
				return "difference";
			case 8:
				return "add";
			case 9:
				return "subtract";
			case 10:
				return "invert";
			case 11:
				return "alpha";
			case 12:
				return "erase";
			case 13:
				return "overlay";
			case 14:
				return "hardlight";
			default:
				return "error";
		}
	};
	
	const SoundTransform = function () {};
	
	const renderBase = function (context) {
		let blendMode = this.blendMode();
		let originalCommands = (blendMode != "normal") ? context.commands.copy() : null; 
	
		context.transformStack.stackPush(this.matrix(), this.colorTransform());
	
		if (originalCommands) {
			context.commands.clear();
		}
		this.renderSelf(context);
		if (originalCommands) {
			var subCommands = context.commands.copy();
			context.commands.replace(originalCommands);
			context.commands.blend(subCommands, blendMode);
		}
	
		context.transformStack.stackPop();
	};
	
	const DisplayObject = function () {
		this._matrix = [1, 0, 0, 1, 0, 0];
		this._colorTransform = [1, 1, 1, 1, 0, 0, 0, 0];
		this._blendMode = "normal";
		this._filters = [];
	
		this._parent = null;
		this._placeFrame = 0;
		this._depth = 0;
		this._name = "";
		this._clipDepth = 0;
		this._nextAvm1Clip = null;
		this._soundTransform = new SoundTransform();
		this._masker = null;
		this._maskee = null;
		this._opaqueBackground = [0, 0, 0, 0];
	
		/// flags
		this.AVM1_REMOVED = false;
		this.VISIBLE = true;
		this.SCALE_ROTATION_CACHED = false;
		this.TRANSFORMED_BY_SCRIPT = false;
		this.PLACED_BY_SCRIPT = false;
		this.INSTANTIATED_BY_TIMELINE = false;
		this.IS_ROOT = false;
		this.LOCK_ROOT = false;
		this.CACHE_AS_BITMAP = false;
		this.HAS_SCROLL_RECT = false;
		this.HAS_EXPLICIT_NAME = false;
		this.SKIP_NEXT_ENTER_FRAME = false;
		this.CACHE_INVALIDATED = false;
	
		this.displayType = "Base";
		this.coll = [0, 0, 0, 1];
		this._debug_colorDisplayType = [0, 0, 0, 1];
	};
	DisplayObject.prototype.matrix = function () {
		return this._matrix;
	};
	DisplayObject.prototype.colorTransform = function () {
		return this._colorTransform;
	};
	DisplayObject.prototype.applyColorTransform = function (colorTransform) {
		this._colorTransform[0] = colorTransform[0];
		this._colorTransform[1] = colorTransform[1];
		this._colorTransform[2] = colorTransform[2];
		this._colorTransform[3] = colorTransform[3];
		this._colorTransform[4] = colorTransform[4];
		this._colorTransform[5] = colorTransform[5];
		this._colorTransform[6] = colorTransform[6];
		this._colorTransform[7] = colorTransform[7];
	};
	DisplayObject.prototype.applyMatrix = function (matrix) {
		this._matrix[0] = matrix[0];
		this._matrix[1] = matrix[1];
		this._matrix[2] = matrix[2];
		this._matrix[3] = matrix[3];
		this._matrix[4] = matrix[4];
		this._matrix[5] = matrix[5];
	};
	DisplayObject.prototype.blendMode = function () {
		return this._blendMode;
	};
	DisplayObject.prototype.setBlendMode = function (mode) {
		this._blendMode = getBlendMode(mode);
	};
	DisplayObject.prototype.depth = function () {
		return this._depth;
	};
	DisplayObject.prototype.setDepth = function (value) {
		this._depth = value;
	};
	DisplayObject.prototype.clipDepth = function () {
		return this._clipDepth;
	};
	DisplayObject.prototype.setClipDepth = function (value) {
		this._clipDepth = value;
	};
	DisplayObject.prototype.placeFrame = function () {
		return this._placeFrame;
	};
	DisplayObject.prototype.setPlaceFrame = function (frame) {
		this._placeFrame = frame;
	};
	DisplayObject.prototype.getParent = function () {
		return this._parent;
	};
	DisplayObject.prototype.setParent = function (context, parent) {
		this._parent = parent;
	};
	DisplayObject.prototype.name = function () {
		return this._name;
	};
	DisplayObject.prototype.setName = function (name) {
		this._name = name;
	};
	DisplayObject.prototype.nextAvm1Clip = function () {
		return this._nextAvm1Clip;
	};
	DisplayObject.prototype.setNextAvm1Clip = function (value) {
		this._nextAvm1Clip = value;
	};
	DisplayObject.prototype.visible = function () {
		return this.VISIBLE;
	};
	DisplayObject.prototype.setVisible = function (value) {
		this.VISIBLE = value;
	};
	DisplayObject.prototype.isRoot = function () {
		return this.IS_ROOT;
	};
	DisplayObject.prototype.setIsRoot = function (bool) {
		this.IS_ROOT = bool;
	};
	DisplayObject.prototype.avm1Removed = function () {
		return this.AVM1_REMOVED;
	};
	DisplayObject.prototype.setAvm1Removed = function (value) {
		this.AVM1_REMOVED = value;
	};
	DisplayObject.prototype.transformedByScript = function () {
		return this.TRANSFORMED_BY_SCRIPT;
	};
	DisplayObject.prototype.setTransformedByScript = function (value) {
		this.TRANSFORMED_BY_SCRIPT = value;
	};
	DisplayObject.prototype.instantiatedByTimeline = function () {
		return this.INSTANTIATED_BY_TIMELINE;
	};
	DisplayObject.prototype.setInstantiatedByTimeline = function (value) {
		this.INSTANTIATED_BY_TIMELINE = value;
	};
	DisplayObject.prototype.shouldSkipNextEnterFrame = function () {
		return this.SKIP_NEXT_ENTER_FRAME;
	};
	DisplayObject.prototype.setSkipNextEnterFrame = function (b) {
		this.SKIP_NEXT_ENTER_FRAME = b;
	};
	DisplayObject.prototype.getId = function () {
		return 0;
	};
	DisplayObject.prototype.setDefaultInstanceName = function (context) {
		if (!this.name().length) {
			var r = context.addInstanceCounter();
			this.setName("instance" + r);
		}
	};
	DisplayObject.prototype.applyPlaceObject = function (context, placeObject) {
		if (!this.transformedByScript()) {
			if ("matrix" in placeObject) {
				this.applyMatrix(placeObject.matrix);
			}
			if ("colorTransform" in placeObject) {
				this.applyColorTransform(placeObject.colorTransform);
			}
			if ("visible" in placeObject) {
				this.setVisible(!!placeObject.visible);
			}
			if ("blendMode" in placeObject) {
				this.setBlendMode(placeObject.blendMode);
			}
			if (this.displayType == "MorphShape" || this.displayType == "Video") {
				if ("ratio" in placeObject) {
					if (this.displayType == "Video") {
						this.seek(context, placeObject.ratio);
					} else {
						this.setRatio(placeObject.ratio);
					}
				}
			}
			if ("backgroundColor" in placeObject) {
			}
		}
	};
	DisplayObject.prototype.replaceWith = function (context, characterId) {};
	DisplayObject.prototype.postInstantiation = function (
		context,
		initObject,
		instantiatedBy,
		runFrame
	) {
		if (runFrame) {
			this.runFrameAvm1();
		}
	};
	DisplayObject.prototype.selfBounds = function () {
		return { xMin: 0, yMin: 0, xMax: 0, yMax: 0 };
	};
	DisplayObject.prototype.render = function (context) {
		renderBase.call(this, context);
	};
	DisplayObject.prototype.debugRenderBounds = function(matrix, colorTransform, tags) {
		var rMatrix = multiplicationMatrix(matrix, this.matrix());
		var rColorTransform = multiplicationColor(colorTransform, this.colorTransform());
		var bounds = this.selfBounds();
		var matrixBounds = boundsMatrix(bounds, rMatrix);
		tags.push([4, this.displayType, this._debug_colorDisplayType[0], this._debug_colorDisplayType[1], this._debug_colorDisplayType[2]]);
		tags.push([3, [+rColorTransform[0].toFixed(3), +rColorTransform[1].toFixed(3), +rColorTransform[2].toFixed(3), +rColorTransform[3].toFixed(3), +rColorTransform[4].toFixed(3), +rColorTransform[5].toFixed(3), +rColorTransform[6].toFixed(3), +rColorTransform[7].toFixed(3)]]);
		var g1 = generateMatrix([bounds.xMin, bounds.yMin], rMatrix);
		var g2 = generateMatrix([bounds.xMax, bounds.yMin], rMatrix);
		var g3 = generateMatrix([bounds.xMax, bounds.yMax], rMatrix);
		var g4 = generateMatrix([bounds.xMin, bounds.yMax], rMatrix);
		tags.push([0, g1[0] | 0, g1[1] | 0, g2[0] | 0, g2[1] | 0, g3[0] | 0, g3[1] | 0, g4[0] | 0, g4[1] | 0]);
		tags.push([1, matrixBounds.xMin | 0, matrixBounds.yMin | 0, matrixBounds.xMax | 0, matrixBounds.yMax | 0]);
		tags.push([2, matrixBounds.xMin | 0, matrixBounds.yMin | 0]);
		if (this instanceof DisplayVideoStream) {
			tags.push([4, this.getDecoderType() + ": " + (this.decoded_frame ? this.decoded_frame[0] : "?"), 0, 232, 0]);
			tags.push([2, (matrixBounds.xMin + 2) | 0, (matrixBounds.yMin + 22) | 0]);
		}
	};
	DisplayObject.prototype.renderSelf = function () {};
	DisplayObject.prototype.enterFrame = function () {};
	DisplayObject.prototype.runFrameAvm1 = function () {};
	DisplayObject.prototype.isInteractive = function () {
		return false;
	};
	DisplayObject.prototype.isContainer = function () {
		return false;
	};
	DisplayObject.prototype.avm1Unload = function (context) {
		if (this.isContainer()) {
			var children = this.iterRenderList();
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				child.avm1Unload(context);
			}
		}
		this.setAvm1Removed(true);
	};
	DisplayObject.prototype.setState = function () {};
	DisplayObject.prototype.applyDisplayObject = function (displayObject) {
		displayObject.applyMatrix(this._matrix);
		displayObject.applyColorTransform(this._colorTransform);
		displayObject._blendMode = "normal";
		displayObject._filters = [];
	
		displayObject._parent = this._parent;
		displayObject._placeFrame = this._placeFrame;
		displayObject._depth = this._depth;
		displayObject._name = this._name;
		displayObject._clipDepth = this._clipDepth;
		displayObject._nextAvm1Clip = this._nextAvm1Clip;
		displayObject._soundTransform = new SoundTransform();
		displayObject._masker = this._masker;
		displayObject._maskee = this._maskee;
		displayObject._opaqueBackground = [0, 0, 0, 0];
	
		/// flags
		displayObject.AVM1_REMOVED = this.AVM1_REMOVED;
		displayObject.VISIBLE = this.VISIBLE;
		displayObject.SCALE_ROTATION_CACHED = this.SCALE_ROTATION_CACHED;
		displayObject.TRANSFORMED_BY_SCRIPT = this.TRANSFORMED_BY_SCRIPT;
		displayObject.PLACED_BY_SCRIPT = this.PLACED_BY_SCRIPT;
		displayObject.INSTANTIATED_BY_TIMELINE = this.INSTANTIATED_BY_TIMELINE;
		displayObject.IS_ROOT = this.IS_ROOT;
		displayObject.LOCK_ROOT = this.LOCK_ROOT;
		displayObject.CACHE_AS_BITMAP = this.CACHE_AS_BITMAP;
		displayObject.HAS_SCROLL_RECT = this.HAS_SCROLL_RECT;
		displayObject.HAS_EXPLICIT_NAME = this.HAS_EXPLICIT_NAME;
		displayObject.SKIP_NEXT_ENTER_FRAME = this.SKIP_NEXT_ENTER_FRAME;
		displayObject.CACHE_INVALIDATED = this.CACHE_INVALIDATED;
	};

	const InteractiveObject = function () {
		DisplayObject.call(this);
		this._mouseEnabled = true;
		this.displayType = "InteractiveObject";
	};
	InteractiveObject.prototype = Object.create(DisplayObject.prototype);
	InteractiveObject.prototype.constructor = InteractiveObject;
	InteractiveObject.prototype.isInteractive = function () {
		return true;
	};
	InteractiveObject.prototype.applyDisplayObject = function (displayObject) {
		DisplayObject.prototype.applyDisplayObject.call(this, displayObject);
		displayObject._mouseEnabled = this._mouseEnabled;
	};

	const ChildContainer = function () {
		this.renderList = [];
		this.depthList = [];
	};
	ChildContainer.prototype.numChildren = function () {
		return this.renderList.length;
	};
	ChildContainer.prototype.replaceId = function (id, child) {
		this.renderList[id] = child;
	};
	ChildContainer.prototype.insertId = function (id, child) {
		if (this.renderList.length) {
			if (id >= this.renderList.length) {
				this.renderList.push(child);
			} else {
				this.renderList.splice(id, 0, child);
			}
		} else {
			this.renderList.push(child);
		}
	};
	ChildContainer.prototype.pushId = function (child) {
		this.renderList.push(child);
	};
	ChildContainer.prototype.removeId = function (id) {
		if (this.renderList.length) {
			if (id >= this.renderList.length) {
				this.renderList.pop();
			} else {
				this.renderList.splice(id, 1);
			}
		}
	};
	ChildContainer.prototype.removeChildFromDepthList = function (child) {
		let depth = child.depth();
		delete this.depthList[depth];
	};
	ChildContainer.prototype.removeChildFromRenderList = function (child, context) {
		let rs = this.renderList.indexOf(child);
		if (rs >= 0) {
			this.removeId(rs);
		} else {
			console.log(child);
		}
	};
	ChildContainer.prototype.getDepth = function (depth) {
		return this.depthList[depth];
	};
	ChildContainer.prototype.insertChildIntoDepthList = function (depth, child) {
		let r = this.depthList[depth];
		this.depthList[depth] = child;
		return r;
	};
	ChildContainer.prototype.replaceAtDepth = function (depth, child) {
		let prevChild = this.insertChildIntoDepthList(depth, child);
		if (prevChild) {
			console.log(prevChild);
		}
		let aboveChild = null;
		for (let i = 0; i < this.depthList.length; i++) {
			const c = this.depthList[i];
			if (c && i !== depth) {
				if (i > depth) {
					aboveChild = c;
					break;
				}
			}
		}
		if (aboveChild) {
			let rs = this.renderList.indexOf(aboveChild);
			if (rs >= 0) {
				this.insertId(rs, child);
			} else {
				this.pushId(child);
			}
		} else {
			this.pushId(child);
		}
	};
	const DisplayObjectContainer = function () {
		InteractiveObject.call(this);
		this.displayType = "Container";
	};
	DisplayObjectContainer.prototype = Object.create(InteractiveObject.prototype);
	DisplayObjectContainer.prototype.constructor = DisplayObjectContainer;
	DisplayObjectContainer.prototype.rawContainer = function () {};
	DisplayObjectContainer.prototype.isContainer = function () {
		return true;
	};
	DisplayObjectContainer.prototype.replaceAtDepth = function (context, depth, child) {
		let rawContainer = this.rawContainer();
		rawContainer.replaceAtDepth(depth, child);
	};
	DisplayObjectContainer.prototype.childByDepth = function (depth) {
		return this.rawContainer().getDepth(depth);
	};
	DisplayObjectContainer.prototype.removeChild = function (context, child) {
		this.removeChildDirectly(context, child);
	};
	DisplayObjectContainer.prototype.removeChildDirectly = function (context, child) {
		let rawContainer = this.rawContainer();
		rawContainer.removeChildFromDepthList(child);
		rawContainer.removeChildFromRenderList(child, context);
		child.avm1Unload(context);
	};
	DisplayObjectContainer.prototype.iterRenderList = function () {
		return this.rawContainer().renderList.slice(0);
	};
	DisplayObjectContainer.prototype.selfBounds = function () {
		let children = this.iterRenderList();
		let xMax = Number.MIN_VALUE;
		let yMax = Number.MIN_VALUE;
		let xMin = Number.MAX_VALUE;
		let yMin = Number.MAX_VALUE;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			let matrix2 = child.matrix();
			let b = boundsMatrix(child.selfBounds(), matrix2);
			xMin = Math.min(xMin, b.xMin);
			xMax = Math.max(xMax, b.xMax);
			yMin = Math.min(yMin, b.yMin);
			yMax = Math.max(yMax, b.yMax);
		}
		if (!children.length) (xMin = 0), (yMin = 0), (xMax = 0), (yMax = 0);
		return { xMin, xMax, yMin, yMax };
	};
	DisplayObjectContainer.prototype.renderSelf = function (context) {
		this.renderChildren(context);
	};
	DisplayObjectContainer.prototype.renderChildren = function (context) {
		const children = this.iterRenderList();
		let clipDepth = 0;
		let clipDepthStack = [];
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			let depth = child.depth();
			while (clipDepth > 0 && depth > clipDepth) {
				let [prevClipDepth, clipChild] = clipDepthStack.pop();
				clipDepth = prevClipDepth;
				context.commands.deactivateMask();
				clipChild.render(context);
				context.commands.popMask();
			}
			if (child.clipDepth() > 0) {
				clipDepthStack.push([clipDepth, child]);
				clipDepth = child.clipDepth();
				context.commands.pushMask();
				child.render(context);
				context.commands.activateMask();
			} else if (child.visible() || context.commands.drawingMask()) {
				child.render(context);
			}
		}
		for (let j = clipDepthStack.length - 1; j >= 0; j--) {
			context.commands.deactivateMask();
			clipDepthStack[j][1].render(context);
			context.commands.popMask();
		}
	};
	DisplayObjectContainer.prototype.debugRenderBounds = function (matrix, colorTransform, tags) {
		var rMatrix = multiplicationMatrix(matrix, this.matrix());
		var rColorTransform = multiplicationColor(colorTransform, this.colorTransform());
		const children = this.iterRenderList();
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			child.debugRenderBounds(rMatrix, rColorTransform, tags);
		}
		if (!this.isRoot()) {
			var bounds = this.selfBounds();
			var matrixBounds = boundsMatrix(bounds, rMatrix);
			tags.push([4, this.displayType, this._debug_colorDisplayType[0], this._debug_colorDisplayType[1], this._debug_colorDisplayType[2],]);
			tags.push([3, [+rColorTransform[0].toFixed(3), +rColorTransform[1].toFixed(3), +rColorTransform[2].toFixed(3), +rColorTransform[3].toFixed(3), +rColorTransform[4].toFixed(3), +rColorTransform[5].toFixed(3), +rColorTransform[6].toFixed(3), +rColorTransform[7].toFixed(3)]]);
			tags.push([1, matrixBounds.xMin | 0, matrixBounds.yMin | 0, matrixBounds.xMax | 0, matrixBounds.yMax | 0]);
			tags.push([2, matrixBounds.xMin | 0, (matrixBounds.yMin | 0) - 20]);
		}
	};
	DisplayObjectContainer.prototype.applyDisplayObject = function (
		displayObject
	) {
		InteractiveObject.prototype.applyDisplayObject.call(
			this,
			displayObject
		);
	};

	const Graphic = function (data) {
		DisplayObject.call(this);
		this.staticData = null;
		this.displayType = "Shape";
		this._debug_colorDisplayType = [0, 0, 255, 1];
		if (data) data.applyDisplayObject(this);
	};
	Graphic.prototype = Object.create(DisplayObject.prototype);
	Graphic.prototype.constructor = Graphic;
	Graphic.fromSwfTag = function (context, swfShape, movie) {
		const data = new Graphic();
		const staticData = new GraphicStatic();
		staticData.id = swfShape.id;
		staticData.movie = movie;
		staticData.shape = swfShape;
		staticData.bounds = swfShape.bounds;
		data.staticData = staticData;
		return data;
	};
	Graphic.prototype.applyDisplayObject = function (displayObject) {
		DisplayObject.prototype.applyDisplayObject.call(this, displayObject);
		displayObject.staticData = this.staticData;
	};
	Graphic.prototype.getId = function () {
		return this.staticData.id;
	};
	Graphic.prototype.replaceWith = function (context, id) {
		let library = context.library.libraryForMovie(this.movie());
		let new_graphic = library.characterById(id);
		this.staticData = new_graphic.staticData;
	};
	Graphic.prototype.renderSelf = function (context) {
		let staticData = this.staticData;
		let renderHandle = staticData.getRenderHandle(context, context.library);
		context.commands.renderShape(renderHandle, context.transformStack.getMatrix(), context.transformStack.getColorTransform());
	};
	Graphic.prototype.selfBounds = function () {
		return this.staticData.bounds;
	};
	Graphic.prototype.movie = function () {
		return this.staticData.movie;
	};
	Graphic.prototype.instantiate = function () {
		return new Graphic(this);
	};
	const GraphicStatic = function () {
		this.id = 0;
		this.movie = null;
		this.shape = null;
		this.renderHandle = null;
		this.bounds = null;
		this.movie = null;
	};
	GraphicStatic.prototype.getRenderHandle = function (context, library) {
		if (!this.renderHandle) this.renderHandle = context.renderer.registerShape(shapeUtils.convert(this.shape, "shape"), library.libraryForMovie(this.movie));
		return this.renderHandle;
	};

	const MorphShape = function (data) {
		DisplayObject.call(this);
		this._ratio = 0;
		this.staticData = null;
		this.displayType = "MorphShape";
		this._debug_colorDisplayType = [0, 255, 255, 1];
		if (data) data.applyDisplayObject(this);
	};
	MorphShape.prototype = Object.create(DisplayObject.prototype);
	MorphShape.prototype.constructor = MorphShape;
	MorphShape.fromSwfTag = function (tag, movie) {
		const morph_shape = new MorphShape();
		const staticData = MorphShapeStatic.fromSwfTag(tag, movie);
		morph_shape.staticData = staticData;
		return morph_shape;
	};
	MorphShape.prototype.applyDisplayObject = function (displayObject) {
		DisplayObject.prototype.applyDisplayObject.call(this, displayObject);
		displayObject._ratio = this._ratio;
		displayObject.staticData = this.staticData;
	};
	MorphShape.prototype.setRatio = function (ratio) {
		this._ratio = ratio;
	};
	MorphShape.prototype.getId = function () {
		return this.staticData.id;
	};
	MorphShape.prototype.movie = function () {
		return this.staticData.movie;
	};
	MorphShape.prototype.selfBounds = function () {
		return this.staticData.getFrame(this._ratio).bounds;
	};
	MorphShape.prototype.renderSelf = function (context) {
		const ratio = this._ratio;
		const static_data = this.staticData;
		const shape_handle = static_data.getShape(context, context.library, ratio);
		context.commands.renderShape(shape_handle, context.transformStack.getMatrix(), context.transformStack.getColorTransform());
	};
	MorphShape.prototype.replaceWith = function (context, id) {
		var library = context.library.libraryForMovie(this.movie());
		var new_graphic = library.characterById(id);
		this.staticData = new_graphic.staticData;
	};
	MorphShape.prototype.instantiate = function () {
		return new MorphShape(this);
	};
	const MorphShapeStatic = function () {
		this.data = null;
		this.id = 0;
		this.morphCaches = [];
		this.movie = null;
	};
	MorphShapeStatic.fromSwfTag = function (tag, movie) {
		const g = new MorphShapeStatic();
		g.id = tag.id;
		g.data = tag;
		g.movie = movie;
		return g;
	};
	MorphShapeStatic.prototype.getFrame = function (ratio) {
		if (!this.morphCaches[ratio]) {
			this.morphCaches[ratio] = this.buildMorphFrame(ratio / 65536);
		}
		return this.morphCaches[ratio];
	};
	MorphShapeStatic.prototype.getShape = function (context, library, ratio) {
		var frame = this.getFrame(ratio);
		if (!frame.shapeHandle) {
			var h = library.libraryForMovie(this.movie);
			var shape = shapeUtils.convert(frame.shapes, "morphshape");
			var handle = context.renderer.registerShape(shape, h);
			frame.shapeHandle = handle;
		}
		return frame.shapeHandle;
	};
	MorphShapeStatic.prototype.lerpTwips = function (start, end, per) {
		var startPer = 1 - per;
		return start * startPer + end * per;
	};
	MorphShapeStatic.prototype.lerpColor = function (startColor, endColor, per) {
		var startPer = 1 - per;
		return [
			Math.floor(startColor[0] * startPer + endColor[0] * per),
			Math.floor(startColor[1] * startPer + endColor[1] * per),
			Math.floor(startColor[2] * startPer + endColor[2] * per),
			startColor[3] * startPer + endColor[3] * per,
		];
	};
	MorphShapeStatic.prototype.lerpMatrix = function (
		startMatrix,
		endMatrix,
		per
	) {
		var startPer = 1 - per;
		return [
			startMatrix[0] * startPer + endMatrix[0] * per,
			startMatrix[1] * startPer + endMatrix[1] * per,
			startMatrix[2] * startPer + endMatrix[2] * per,
			startMatrix[3] * startPer + endMatrix[3] * per,
			startMatrix[4] * startPer + endMatrix[4] * per,
			startMatrix[5] * startPer + endMatrix[5] * per,
		];
	};
	MorphShapeStatic.prototype.lerpFill = function (fillStyle, per) {
		var fillStyleType = fillStyle.type;
		if (fillStyleType === 0x00) {
			return {
				color: this.lerpColor(fillStyle.startColor, fillStyle.endColor, per),
				type: fillStyleType,
			};
		} else {
			if (fillStyleType == 0x40 || fillStyleType == 0x41 || fillStyleType == 0x42 || fillStyleType == 0x43) {
				return {
					bitmapId: fillStyle.bitmapId,
					bitmapMatrix: this.lerpMatrix(fillStyle.bitmapStartMatrix, fillStyle.bitmapEndMatrix, per),
					isSmoothed: fillStyle.isSmoothed,
					isRepeating: fillStyle.isRepeating,
					type: fillStyleType,
				};
			} else {
				var gradient = fillStyle.gradient;
				if (!gradient) gradient = fillStyle.linearGradient;
				if (!gradient) gradient = fillStyle.radialGradient;
				var focalPoint = 0;
				if (fillStyleType == 19)
					focalPoint = this.lerpTwips(fillStyle.startFocalPoint, fillStyle.endFocalPoint, per);
				var gRecords = [];
				var GradientRecords = gradient.gradientRecords;
				for (var gIdx = 0; gIdx < GradientRecords.length; gIdx++) {
					var gRecord = GradientRecords[gIdx];
					gRecords[gIdx] = {
						color: this.lerpColor(gRecord.startColor, gRecord.endColor, per),
						ratio: this.lerpTwips(gRecord.startRatio, gRecord.endRatio, per),
					};
				}
				return {
					gradient: {
						matrix: this.lerpMatrix(gradient.startMatrix, gradient.endMatrix, per),
						gradientRecords: gRecords,
						spreadMode: gradient.spreadMode,
						interpolationMode: gradient.interpolationMode,
					},
					focalPoint,
					type: fillStyleType,
				};
			}
		}
	};
	MorphShapeStatic.prototype.lerpLine = function (lineStyle, per) {
		var width = this.lerpTwips(lineStyle.startWidth, lineStyle.endWidth, per);
		if (lineStyle.fillType) {
			return {
				width: width,
				fillType: this.lerpFill(lineStyle.fillType, per),
			};
		} else {
			return {
				width: width,
				color: this.lerpColor(lineStyle.startColor, lineStyle.endColor, per),
			};
		}
	};
	MorphShapeStatic.prototype.buildEdges = function (per) {
		var startPer = 1 - per;
		var startPosition = { x: 0, y: 0 };
		var endPosition = { x: 0, y: 0 };
		var StartRecords = JSON.parse(JSON.stringify(this.data.startEdges));
		var EndRecords = JSON.parse(JSON.stringify(this.data.endEdges));
		var StartRecordLength = StartRecords.length;
		var EndRecordLength = EndRecords.length;
		var length = Math.max(StartRecordLength, EndRecordLength);
		for (var i = 0; i < length; i++) {
			var addRecode = {};
			var StartRecord = StartRecords[i];
			var EndRecord = EndRecords[i];
			if (!StartRecord || !EndRecord) continue;
			if (!StartRecord.isChange && !EndRecord.isChange) {
				if (StartRecord.isCurved) {
					startPosition.x += StartRecord.controlDeltaX + StartRecord.anchorDeltaX;
					startPosition.y += StartRecord.controlDeltaY + StartRecord.anchorDeltaY;
				} else {
					startPosition.x += StartRecord.deltaX;
					startPosition.y += StartRecord.deltaY;
				}
				if (EndRecord.isCurved) {
					endPosition.x += EndRecord.controlDeltaX + EndRecord.anchorDeltaX;
					endPosition.y += EndRecord.controlDeltaY + EndRecord.anchorDeltaY;
				} else {
					endPosition.x += EndRecord.deltaX;
					endPosition.y += EndRecord.deltaY;
				}
				continue;
			}
			if (StartRecord.isChange && !EndRecord.isChange) {
				addRecode = {
					fillStyle0: StartRecord.fillStyle0,
					fillStyle1: StartRecord.fillStyle1,
					lineStyle: StartRecord.lineStyle,
					stateFillStyle0: StartRecord.stateFillStyle0,
					stateFillStyle1: StartRecord.stateFillStyle1,
					stateLineStyle: StartRecord.stateLineStyle,
					stateMoveTo: StartRecord.stateMoveTo,
					stateNewStyles: StartRecord.stateNewStyles,
					isChange: true,
				};
				if (StartRecord.stateMoveTo) {
					addRecode.moveX = endPosition.x;
					addRecode.moveY = endPosition.y;
					startPosition.x = StartRecord.moveX;
					startPosition.y = StartRecord.moveY;
				}
				EndRecords.splice(i, 0, addRecode);
			} else if (!StartRecord.isChange && EndRecord.isChange) {
				addRecode = {
					fillStyle0: EndRecord.fillStyle0,
					fillStyle1: EndRecord.fillStyle1,
					lineStyle: EndRecord.lineStyle,
					stateFillStyle0: EndRecord.stateFillStyle0,
					stateFillStyle1: EndRecord.stateFillStyle1,
					stateLineStyle: EndRecord.stateLineStyle,
					stateMoveTo: EndRecord.stateMoveTo,
					stateNewStyles: EndRecord.stateNewStyles,
					isChange: true,
				};
				if (EndRecord.stateMoveTo) {
					addRecode.moveX = startPosition.x;
					addRecode.moveY = startPosition.y;
					endPosition.x = EndRecord.moveX;
					endPosition.y = EndRecord.moveY;
				}
				StartRecords.splice(i, 0, addRecode);
			} else {
				if (StartRecord.stateMoveTo) {
					startPosition.x = StartRecord.moveX;
					startPosition.y = StartRecord.moveY;
				}
				if (EndRecord.stateMoveTo) {
					endPosition.x = EndRecord.moveX;
					endPosition.y = EndRecord.moveY;
				}
			}
		}
		var FillType = 0;
		var FillStyle = 0;
		length = StartRecords.length;
		for (var i = 0; i < length; i++) {
			var record = StartRecords[i];
			if (!record.isChange) continue;
			if (record.stateFillStyle0) FillStyle = record.fillStyle0;
			if (FillStyle) {
				record.stateFillStyle0 = 1;
				record.stateFillStyle1 = 1;
				if (FillType) {
					record.fillStyle0 = 0;
					record.fillStyle1 = FillStyle;
				} else {
					record.fillStyle0 = FillStyle;
					record.fillStyle1 = 0;
				}
			} else {
				record.stateFillStyle1 = 1;
				record.fillStyle1 = 0;
			}
			FillType = FillType ? 0 : 1;
		}
		var newShapeRecords = [];
		var len = StartRecords.length;
		for (var i = 0; i < len; i++) {
			var StartRecord = StartRecords[i];
			if (!StartRecord) continue;
			var EndRecord = EndRecords[i];
			if (!EndRecord) continue;
			var newRecord = {};
			if (StartRecord.isChange) {
				var MoveX = 0;
				var MoveY = 0;
				if (StartRecord.stateMoveTo === 1) {
					MoveX = StartRecord.moveX * startPer + EndRecord.moveX * per;
					MoveY = StartRecord.moveY * startPer + EndRecord.moveY * per;
				}
				newRecord = {
					fillStyle0: StartRecord.fillStyle0,
					fillStyle1: StartRecord.fillStyle1,
					lineStyle: StartRecord.lineStyle,
					moveX: MoveX,
					moveY: MoveY,
					stateFillStyle0: StartRecord.stateFillStyle0,
					stateFillStyle1: StartRecord.stateFillStyle1,
					stateLineStyle: StartRecord.stateLineStyle,
					stateMoveTo: StartRecord.stateMoveTo,
					stateNewStyles: StartRecord.stateNewStyles,
					isChange: true,
				};
			} else {
				newRecord = this.lerpEdges(StartRecord, EndRecord, per);
			}
			newShapeRecords[i] = newRecord;
		}
		return newShapeRecords;
	};
	MorphShapeStatic.prototype.lerpEdges = function (start, end, per) {
		var startIsCurved = start.isCurved;
		var endIsCurved = end.isCurved;
		if (!startIsCurved && !endIsCurved) {
			return {
				deltaX: this.lerpTwips(start.deltaX, end.deltaX, per),
				deltaY: this.lerpTwips(start.deltaY, end.deltaY, per),
				isCurved: false,
				isChange: false,
			};
		} else if (startIsCurved && endIsCurved) {
			return {
				controlDeltaX: this.lerpTwips(start.controlDeltaX, end.controlDeltaX, per),
				controlDeltaY: this.lerpTwips(start.controlDeltaY, end.controlDeltaY, per),
				anchorDeltaX: this.lerpTwips(start.anchorDeltaX, end.anchorDeltaX, per),
				anchorDeltaY: this.lerpTwips(start.anchorDeltaY, end.anchorDeltaY, per),
				isCurved: true,
				isChange: false,
			};
		} else if (!startIsCurved && endIsCurved) {
			var deltaX = start.deltaX / 2;
			var deltaY = start.deltaY / 2;
			return {
				controlDeltaX: this.lerpTwips(deltaX, end.controlDeltaX, per),
				controlDeltaY: this.lerpTwips(deltaY, end.controlDeltaY, per),
				anchorDeltaX: this.lerpTwips(deltaX, end.anchorDeltaX, per),
				anchorDeltaY: this.lerpTwips(deltaY, end.anchorDeltaY, per),
				isCurved: true,
				isChange: false,
			};
		} else if (startIsCurved && !endIsCurved) {
			var deltaX = end.deltaX / 2;
			var deltaY = end.deltaY / 2;
			return {
				controlDeltaX: this.lerpTwips(start.controlDeltaX, deltaX, per),
				controlDeltaY: this.lerpTwips(start.controlDeltaY, deltaY, per),
				anchorDeltaX: this.lerpTwips(start.anchorDeltaX, deltaX, per),
				anchorDeltaY: this.lerpTwips(start.anchorDeltaY, deltaY, per),
				isCurved: true,
				isChange: false,
			};
		}
	};
	MorphShapeStatic.prototype.buildMorphFrame = function (per) {
		var shapes = {
			lineStyles: [],
			fillStyles: [],
			shapeRecords: [],
		};
		var lineStyles = JSON.parse(JSON.stringify(this.data.morphLineStyles));
		var fillStyles = JSON.parse(JSON.stringify(this.data.morphFillStyles));
		for (var i = 0; i < lineStyles.length; i++) {
			shapes.lineStyles[i] = this.lerpLine(lineStyles[i], per);
		}
		for (var i = 0; i < fillStyles.length; i++) {
			shapes.fillStyles[i] = this.lerpFill(fillStyles[i], per);
		}
		shapes.shapeRecords = this.buildEdges(per);
		var bounds = shapeUtils.calculateShapeBounds(shapes.shapeRecords);
		return {
			shapeHandle: null,
			bounds,
			shapes,
		};
	};

	const StaticText = function (data) {
		DisplayObject.call(this);
		this.displayType = "StaticText";
		this._debug_colorDisplayType = [255, 0, 255, 1];
		if (data) data.applyDisplayObject(this);
	};
	StaticText.prototype = Object.create(DisplayObject.prototype);
	StaticText.prototype.constructor = StaticText;
	StaticText.fromSwfTag = function (context, movie, tag) {
		const text = new StaticText();
		const staticData = new TextStatic();
		staticData.id = tag.id;
		staticData.bounds = tag.bounds;
		staticData.matrix = tag.matrix;
		staticData.textBlocks = tag.records;
		staticData.movie = movie;
		text.staticData = staticData;
		return text;
	};
	StaticText.prototype.applyDisplayObject = function (displayObject) {
		DisplayObject.prototype.applyDisplayObject.call(this, displayObject);
		displayObject.staticData = this.staticData;
	};
	StaticText.prototype.runFrameAvm1 = function () {};
	StaticText.prototype.selfBounds = function () {
		return this.staticData.bounds;
	};
	StaticText.prototype.renderSelf = function (context) {
		var library = context.library.libraryForMovie(this.movie());
		var offsetX = 0;
		var offsetY = 0;
		var color = [0, 0, 0, 0];
		var textHeight = 0;
		var fontData;
		context.transformStack.stackPush(this.staticData.matrix, [1, 1, 1, 1, 0, 0, 0, 0]);
		for (var i = 0; i < this.staticData.textBlocks.length; i++) {
			var record = this.staticData.textBlocks[i];
			if ("fontId" in record) fontData = library.characterById(record.fontId);
			if ("XOffset" in record) offsetX = record.XOffset;
			if ("YOffset" in record) offsetY = record.YOffset;
			if ("textColor" in record) color = record.textColor;
			if ("textHeight" in record) textHeight = record.textHeight;
			var entries = record.glyphEntries;
			var _scale = textHeight / fontData.scale;
			for (var idx = 0; idx < entries.length; idx++) {
				var entry = entries[idx];
				var glyph = fontData.getGlyph(entry.index);
				if (glyph) {
					var shapeRender = glyph.shapeHandle;
					if (shapeRender) {
						var _matrix = [_scale, 0, 0, _scale, offsetX, offsetY];
						context.transformStack.stackPush(_matrix, [color[0] / 255, color[1] / 255, color[2] / 255, color[3], 0, 0, 0, 0]);
						var m2 = context.transformStack.getMatrix();
						var colorTransform = context.transformStack.getColorTransform();
						context.commands.renderShape(shapeRender, m2, colorTransform);
						context.transformStack.stackPop();
						offsetX += entry.advance;
					}
				}
			}
		}
		context.transformStack.stackPop();
	};
	StaticText.prototype.replaceWith = function (context, id) {
		var library = context.library.libraryForMovie(this.movie());
		var new_graphic = library.characterById(id);
		this.staticData = new_graphic.staticData;
	};
	StaticText.prototype.getId = function () {
		return this.staticData.id;
	};
	StaticText.prototype.instantiate = function () {
		return new StaticText(this);
	};
	StaticText.prototype.movie = function () {
		return this.staticData.movie;
	};
	const TextStatic = function () {
		this.id = 0;
		this.settings = null;
		this.movie = null;
		this.bounds = null;
		this.matrix = [1, 0, 0, 1, 0, 0];
		this.textBlocks = [];
	};
	TextStatic.prototype.setRenderSettings = function (settings) {};
	const TextField = function (data) {
		InteractiveObject.call(this);
		this.staticData = null;
		this.displayType = "TextField";
		this._debug_colorDisplayType = [255, 255, 0, 1];
		if (data) data.applyDisplayObject(this);
	};
	TextField.prototype = Object.create(InteractiveObject.prototype);
	TextField.prototype.constructor = TextField;
	TextField.fromSwfTag = function (context, movie, edit_text) {
		const data = new TextField();
		const staticData = new EditTextStatic();
		staticData.id = edit_text.id;
		staticData.swf = movie;
		staticData.bounds = edit_text.bounds;
		data.staticData = staticData;
		return data;
	};
	TextField.prototype.applyDisplayObject = function (displayObject) {
		InteractiveObject.prototype.applyDisplayObject.call(this, displayObject);
		displayObject.staticData = this.staticData;
	};
	TextField.prototype.selfBounds = function () {
		return this.staticData.bounds;
	};
	TextField.prototype.getId = function () {
		return this.staticData.id;
	};
	TextField.prototype.instantiate = function () {
		return new TextField(this);
	};
	TextField.prototype.movie = function () {
		return this.staticData.swf;
	};
	const EditTextStatic = function () {
		this.swf = null;
		this.id = null;
		this.bounds = null;
	};
	const BitmapGraphic = function (data) {
		DisplayObject.call(this);
		this._bitmapH = null;
		this._id = 0;
		this._size = [0, 0];
		this._debug_colorDisplayType = [255, 155, 0, 1];
		this.displayType = "Bitmap";
		if (data) data.applyDisplayObject(this);
	};
	BitmapGraphic.prototype = Object.create(DisplayObject.prototype);
	BitmapGraphic.prototype.constructor = BitmapGraphic;
	BitmapGraphic.createNew = function (context, id, bitmap) {
		let h = new BitmapGraphic();
		h._bitmapH = bitmap;
		h._id = id;
		h._size = [bitmap.width, bitmap.height];
		return h;
	};
	BitmapGraphic.prototype.applyDisplayObject = function (displayObject) {
		DisplayObject.prototype.applyDisplayObject.call(this, displayObject);
		displayObject._bitmapH = this._bitmapH;
		displayObject._id = this._id;
		displayObject._size = this._size.slice(0);
	};
	BitmapGraphic.prototype.selfBounds = function () {
		return {
			xMin: 0,
			yMin: 0,
			xMax: this._size[0] * 20,
			yMax: this._size[1] * 20,
		};
	};
	BitmapGraphic.prototype.bitmapH = function () {
		return this._bitmapH;
	};
	BitmapGraphic.prototype.renderSelf = function (context) {
		context.transformStack.stackPush([20, 0, 0, 20, 0, 0], [1, 1, 1, 1, 0, 0, 0, 0]);
		context.commands.renderBitmap(this.bitmapH(), context.transformStack.getMatrix(), context.transformStack.getColorTransform(), false);
		context.transformStack.stackPop();
	};
	BitmapGraphic.prototype.getId = function () {
		return this._id;
	};
	BitmapGraphic.prototype.instantiate = function () {
		return new BitmapGraphic(this);
	};
	const DisplayVideoStream = function (data) {
		DisplayObject.call(this);
		this.__size = [0, 0];
		this.__movie = null;
		this._ratio = 0;
		this.stream = {
			isInstantiated: false,
			result: 0
		};
		this.keyframes = [];
		this.source = null;
		this.isSmoothed = false;
		this.decoded_frame = [0, null];
		this._debug_colorDisplayType = [255, 100, 100, 1];
		this.displayType = "Video";
		if (data) data.applyDisplayObject(this);
	};
	DisplayVideoStream.prototype = Object.create(DisplayObject.prototype);
	DisplayVideoStream.prototype.constructor = DisplayVideoStream;
	DisplayVideoStream.fromSwfTag = function (movie, streamdef) {
		const h = new DisplayVideoStream();
		h.source = {
			type: "swf",
			streamdef,
			frames: []
		};
		h.__size = [streamdef.width, streamdef.height];
		h.__movie = movie;
		return new DisplayVideoStream(h);
	};
	DisplayVideoStream.prototype.applyDisplayObject = function (displayObject) {
		DisplayObject.prototype.applyDisplayObject.call(this, displayObject);
		displayObject.__size = this.__size.slice(0);
		displayObject.__movie = this.__movie;
		displayObject._ratio = this._ratio;
		displayObject.stream = {
			isInstantiated: false,
			result: 0
		};
		displayObject.isSmoothed = this.isSmoothed;
		displayObject.source = this.source;
		displayObject.keyframes = [];
		displayObject.decoded_frame = null;
	};
	DisplayVideoStream.prototype.selfBounds = function () {
		return {
			xMin: 0,
			yMin: 0,
			xMax: this.__size[0] * 20,
			yMax: this.__size[1] * 20,
		};
	};
	DisplayVideoStream.prototype.movie = function () {
		return this.__movie;
	};
	DisplayVideoStream.prototype.setRatio = function (ratio) {
		this._ratio = ratio;
	};
	DisplayVideoStream.prototype.getDecoderType = function () {
		if (this.source) {
			if (this.source.type == "swf") {
				if (this.stream.isInstantiated && this.stream.result) {
					var decoder = this.stream.result.decoder;
					if (decoder) {
						if (decoder instanceof H263Decoder) {
							return "H.263";
						} else if (decoder instanceof ScreenVideoDecoder) {
							return "Screen Video";
						} else if (decoder instanceof VP6Decoder) {
							return "Vp6";
						} else {
							return "?";
						}
					}
				}
			}
		}
		return "";
	};
	DisplayVideoStream.prototype.seek = function (context, frame_id) {
		if (!this.stream.isInstantiated) {
			this.stream.result = frame_id;
			return;
		}
		var num_frames = this.source.streamdef.numFrames;
		let last_frame = this.decoded_frame ? this.decoded_frame[0] : -1;

		if (last_frame == frame_id) return;

		let is_ordered_seek = (frame_id == 0) || frame_id == (last_frame + 1);

		let sweep_from = frame_id;
		if (!is_ordered_seek) {
			var keyframes = this.keyframes;
			var isE = false;
			for (let i = frame_id; i >= 0; i--) {
				if (i in keyframes) {
					const isKeyframe = keyframes[i];
					if (!isKeyframe) {
						sweep_from = i;
						isE = true;
						break;
					}
				}
			}
			if (!isE) return;
		}
		
		var fr = sweep_from;
		while (fr <= frame_id) {
			this.seek_internal(context, fr);
			fr++;
		}
	};
	DisplayVideoStream.prototype.seek_internal = function (context, frameId) {
		if (!this.stream.isInstantiated) return;
		let stream = this.stream.result;
		var source = this.source;
		var res;
		var frame = source.frames[frameId];
		if (frame) {
			var encframe = {
				codec: source.streamdef.codec,
				data: frame,
				frameId,
			};
			res = context.video.decodeVideoStreamFrame(stream, encframe, context.renderer);
		} else {
			res = this.decoded_frame[1];
		}
		this.decoded_frame = [frameId, res];
	};
	DisplayVideoStream.prototype.postInstantiation = function (context, initObject, instantiatedBy, runFrame) {
		var source = this.source;
		var streamdef = this.source.streamdef;
		this.isSmoothed = !!streamdef.isSmoothed;
		var stream = context.video.registerVideoStream(streamdef.numFrames, [streamdef.width, streamdef.height], streamdef.codec, streamdef.codec);
		var keyframes = [];
		if (!stream.decoder) return;
		for (let i = 0; i < source.frames.length; i++) {
			var frame = source.frames[i];
			if (!frame) continue;
			let dep = context.video.preloadVideoStreamFrame(stream, {
				codec: source.streamdef.codec,
				data: frame,
				frameId: i,
			});
			keyframes[i] = dep;
		}
		this.keyframes = keyframes;
		var starting_seek = (this.stream.isInstantiated ? 0 : this.stream.result);
		this.stream.isInstantiated = true;
		this.stream.result = stream;
		this.seek(context, starting_seek);
	};
	DisplayVideoStream.prototype.preloadSwfFrame = function (videoframe) {
		this.source.frames[videoframe.frameNum] =  videoframe.data;
	};
	DisplayVideoStream.prototype.renderSelf = function (context) {
		var decoded_frame = this.decoded_frame;
		if (decoded_frame) {
			context.transformStack.stackPush([20,0,0,20,0,0],[1,1,1,1,0,0,0,0]);
			if (decoded_frame[1]) 
				context.commands.renderBitmap(decoded_frame[1], context.transformStack.getMatrix(), context.transformStack.getColorTransform(), this.isSmoothed);
			context.transformStack.stackPop();	
		}
	};
	DisplayVideoStream.prototype.instantiate = function () {
		return new DisplayVideoStream(this);
	};
	const typeButton = {
		up: "buttonStateUp",
		over: "buttonStateOver",
		down: "buttonStateDown",
	};
	const Avm1Button = function (data) {
		DisplayObjectContainer.call(this);
		this.container = null;
		this.staticData = null;
		this._state = "up";
		this.initialized = false;
		this.displayType = "Buttom";
		this._debug_colorDisplayType = [0, 255, 0, 1];
		if (data) data.applyDisplayObject(this);
	};
	Avm1Button.prototype = Object.create(DisplayObjectContainer.prototype);
	Avm1Button.prototype.constructor = Avm1Button;
	Avm1Button.fromSwfTag = function (button, sourceMovie) {
		const b = new Avm1Button();
		const staticData = new ButtonStatic();
		staticData.id = button.id;
		staticData.movie = sourceMovie.movie;
		staticData.records = button.records;
		b.staticData = staticData;
		return b;
	};
	Avm1Button.prototype.applyDisplayObject = function (displayObject) {
		DisplayObjectContainer.prototype.applyDisplayObject.call(this, displayObject);
		displayObject.staticData = this.staticData;
		displayObject.container = new ChildContainer();
	};
	Avm1Button.prototype.rawContainer = function () {
		return this.container;
	};
	Avm1Button.prototype.getId = function () {
		return this.staticData.id;
	};
	Avm1Button.prototype.postInstantiation = function (context, initObject, instantiatedBy, runFrame) {
		this.setDefaultInstanceName(context);
		context.avm1.addExecuteList(this);
	};
	Avm1Button.prototype.setState = function (context, state) {
		let library = context.library.libraryForMovie(this.movie());
		this._state = state;
		let removedDepths = [];
		let cs = this.iterRenderList();
		for (let f = 0; f < cs.length; f++) {
			const jdf = cs[f];
			const de = jdf.depth();
			removedDepths[de] = jdf;
		}
		let children = [];
		for (let i = 0; i < this.staticData.records.length; i++) {
			let record = this.staticData.records[i];
			if (record[typeButton[state]]) {
				removedDepths[record.depth] = null;
				let child = null;
				let child1 = this.childByDepth(record.depth);
				if (child1) if (child1.getId() == record.characterId) child = child1;
				if (!child) {
					child = library.instantiateById(record.characterId);
					child.setParent(context, this);
					child.setDepth(record.depth);
					children.push([record.depth, child]);
				}
				child.applyMatrix(record.matrix);
				if ("colorTransform" in record)
					child.applyColorTransform(record.colorTransform);
				if ("blendMode" in record) 
					child.setBlendMode(record.blendMode);
			}
		}
		for (let k = 0; k < removedDepths.length; k++) {
			const d = removedDepths[k];
			if (d) {
				let child = this.childByDepth(k);
				if (child) {
					this.removeChild(context, child);
				}
			}
		}
		for (let o = 0; o < children.length; o++) {
			const c = children[o];
			let depth = c[0];
			let lastC = this.childByDepth(depth);
			if (lastC) this.removeChild(context, lastC);
			let child = c[1];
			child.postInstantiation(context, null, null, false);
			child.runFrameAvm1(context);
			this.replaceAtDepth(context, depth, child);
		}
	};
	Avm1Button.prototype.avm1Unload = function (context) {
		this.setAvm1Removed(true);
	};
	Avm1Button.prototype.runFrameAvm1 = function (context) {
		if (!this.initialized) {
			this.initialized = true;
			this.setState(context, "up");
		}
	};
	Avm1Button.prototype.renderSelf = function (c) {
		this.renderChildren(c);
	};
	Avm1Button.prototype.instantiate = function () {
		return new Avm1Button(this);
	};
	Avm1Button.prototype.movie = function () {
		return this.staticData.movie;
	};
	const ButtonStatic = function () {
		this.id = 0;
		this.records = [];
		this.actions = [];
		this.upToOverSound = null;
		this.overToDownSound = null;
		this.downToOverSound = null;
		this.overToUpSound = null;
	};
	function removeIdArray(array, i) {
		if (array.length) {
			if (i >= array.length) {
				array.pop();
			} else {
				array.splice(i, 1);
			}
		}
	}
	function decodeDefineBitsLossless(bitmapTag) {
		var isAlpha = bitmapTag.version == 2;
		var width = bitmapTag.width;
		var height = bitmapTag.height;
		var format = bitmapTag.format;
		var colorTableSize = 0;
		if (format === 3) colorTableSize = bitmapTag.numColors + 1;
		var sizeZLib = 5;
		var dat = ZLib.decompress(bitmapTag.data, width * height * sizeZLib, 0);
		var data = new Uint8Array(dat);
		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		var imageContext = canvas.getContext("2d");
		var imgData = imageContext.createImageData(width, height);
		var pxData = imgData.data;
		var idx = 0;
		var pxIdx = 0;
		var x = width;
		var y = height;
		if (format === 5 && !isAlpha) {
			idx = 0;
			pxIdx = 0;
			for (y = height; y--; ) {
				for (x = width; x--; ) {
					idx++;
					pxData[pxIdx++] = data[idx++];
					pxData[pxIdx++] = data[idx++];
					pxData[pxIdx++] = data[idx++];
					pxData[pxIdx++] = 255;
				}
			}
		} else {
			var bpp = isAlpha ? 4 : 3;
			var cmIdx = colorTableSize * bpp;
			var pad = 0;
			if (colorTableSize) pad = ((width + 3) & ~3) - width;
			for (y = height; y--; ) {
				for (x = width; x--; ) {
					idx = colorTableSize ? data[cmIdx++] * bpp : cmIdx++ * bpp;
					if (!isAlpha) {
						pxData[pxIdx++] = data[idx++];
						pxData[pxIdx++] = data[idx++];
						pxData[pxIdx++] = data[idx++];
						idx++;
						pxData[pxIdx++] = 255;
					} else {
						var alpha = format === 3 ? data[idx + 3] : data[idx++];
						pxData[pxIdx++] = data[idx++];
						pxData[pxIdx++] = data[idx++];
						pxData[pxIdx++] = data[idx++];
						pxData[pxIdx++] = alpha;
						if (format === 3) idx++;
					}
				}
				cmIdx += pad;
			}
		}
		imageContext.putImageData(imgData, 0, 0);
		return canvas;
	}
	function glueTablesToJpeg(jpedData, jpedTable) {
		if (jpedTable && jpedTable.byteLength > 4) {
			var margeData = [];
			var _jpegTables = new Uint8Array(jpedTable);
			var len = _jpegTables.length - 2;
			for (var idx = 0; idx < len; idx++)
				margeData[margeData.length] = _jpegTables[idx];
			len = jpedData.length;
			for (idx = 2; idx < len; idx++)
				margeData[margeData.length] = jpedData[idx];
			return margeData;
		} else {
			return jpedData;
		}
	}
	function removeInvalidJpegData(JPEGData) {
		var i = 0;
		var idx = 0;
		var str = "";
		var length = JPEGData.length;
		if (JPEGData[0] === 0xff && JPEGData[1] === 0xd9 && JPEGData[2] === 0xff && JPEGData[3] === 0xd8) {
			for (i = 4; i < length; i++) 
				str += String.fromCharCode(JPEGData[i]);
		} else if (JPEGData[i++] === 0xff && JPEGData[i++] === 0xd8) {
			for (idx = 0; idx < i; idx++) 
				str += String.fromCharCode(JPEGData[idx]);
			while (i < length) {
				if (JPEGData[i] === 0xff) {
					if (JPEGData[i + 1] === 0xd9 && JPEGData[i + 2] === 0xff && JPEGData[i + 3] === 0xd8) {
						i += 4;
						for (idx = i; idx < length; idx++) 
							str += String.fromCharCode(JPEGData[idx]);
						break;
					} else if (JPEGData[i + 1] === 0xda) {
						for (idx = i; idx < length; idx++) 
							str += String.fromCharCode(JPEGData[idx]);
						break;
					} else {
						var segmentLength = (JPEGData[i + 2] << 8) + JPEGData[i + 3] + i + 2;
						for (idx = i; idx < segmentLength; idx++) 
							str += String.fromCharCode(JPEGData[idx]);
						i += segmentLength - i;
					}
				}
			}
		} else {
			for (i = 0; i < length; i++) {
				str += String.fromCharCode(JPEGData[i]);
			}
		}
		return str;
	}
	function decodeDefineBitsJpeg(jpedData, alphaData, callback) {
		var image = new Image();
		image.onload = function () {
			if (alphaData) {
				var width = image.width;
				var height = image.height;
				var dat = ZLib.decompress(alphaData, width * height, 0);
				var adata = new Uint8Array(dat);
				var canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				var imageContext = canvas.getContext("2d");
				imageContext.drawImage(image, 0, 0, width, height);
				var imgData = imageContext.getImageData(0, 0, width, height);
				var pxData = imgData.data;
				var pxIdx = 3;
				var len = width * height;
				for (var i = 0; i < len; i++) {
					pxData[pxIdx] = adata[i];
					pxIdx += 4;
				}
				imageContext.putImageData(imgData, 0, 0);
				callback(canvas);
			} else {
				callback(image);
			}
		};
		image.onerror = function () {
			console.log("jped failed");
			callback(null);
		};
		var fi = removeInvalidJpegData(jpedData);
		image.src = "data:image/jpeg;base64," + window.btoa(fi);
	}
	const objectCopy = function (src) {
		const obj = {};
		for (var name in src) obj[name] = src[name];
		return obj;
	};
	const GotoPlaceObject = function (frame, place, isRewind, index) {
		this.frame = frame;
		this.place = place;
		this.isRewind = isRewind;
		this.index = index;
		this.placeData = objectCopy(place);
		if (isRewind) {
			if ("characterId" in place && !place.isMove) {
				if (!("matrix" in place)) this.placeData.matrix = [1, 0, 0, 1, 0, 0];
				if (!("colorTransform" in place)) this.placeData.colorTransform = [1, 1, 1, 1, 0, 0, 0, 0];
				//if ("visible" in place) this.placeData.visible = place.visible;
				if (!("ratio" in place)) this.placeData.ratio = 0;
				//if (!("backgroundColor" in place)) this.placeData.backgroundColor = [0, 0, 0, 0];
			}
		}
	};
	GotoPlaceObject.prototype.getDepth = function () {
		return this.placeData.depth;
	};
	GotoPlaceObject.prototype.merge = function (next) {
		let cur_place = this.placeData;
		let next_place = next.placeData;
		if ("characterId" in next_place) {
			cur_place.characterId = next_place.characterId;
			cur_place.isMove = next_place.isMove;
			this.frame = next.frame;
		}
		if ("matrix" in next_place) cur_place.matrix = next_place.matrix;
		if ("colorTransform" in next_place)
			cur_place.colorTransform = next_place.colorTransform;
		if ("visible" in next_place) cur_place.visible = next_place.visible;
		if ("ratio" in next_place) cur_place.ratio = next_place.ratio;
		if ("backgroundColor" in next_place)
			cur_place.backgroundColor = next_place.backgroundColor;
	};
	const MovieClip = function (data) {
		DisplayObjectContainer.call(this);
	
		this.staticData = null;
		this.container = null;
		this._currentFrame = 0;
		this.audioStream = null;
		this.tagStreamPos = 0;
	
		this.playFlag = false;
		this.loopFlag = false;
		this.INITIALIZED = false;
		this.PROGRAMMATICALLY_PLAYED = false;
		this.EXECUTING_AVM2_FRAME_SCRIPT = false;
		this.LOOP_QUEUED = false;
	
		this.displayType = "MovieClip";
		this._debug_colorDisplayType = [255, 0, 0, 1];
		if (data) data.applyDisplayObject(this);
	};
	MovieClip.prototype = Object.create(DisplayObjectContainer.prototype);
	MovieClip.prototype.constructor = MovieClip;
	MovieClip.playerRootMovie = function (movie) {
		var numFrames = movie.numFrames;
		const mc = new MovieClip();
		mc.container = new ChildContainer();
		mc.playFlag = true;
		mc.staticData = MovieClipStatic.withData(
			0,
			SwfSlice.from(movie),
			numFrames
		);
		mc.setIsRoot(true);
		return mc;
	};
	MovieClip.createNewWithData = function (id, swf, numFrames) {
		const mc = new MovieClip();
		mc.staticData = MovieClipStatic.withData(id, swf, numFrames);
		mc.playFlag = true;
		return mc;
	};
	MovieClip.prototype.applyDisplayObject = function (displayObject) {
		DisplayObjectContainer.prototype.applyDisplayObject.call(this, displayObject);
		displayObject.staticData = this.staticData;
		displayObject.container = new ChildContainer();
		displayObject._currentFrame = this._currentFrame;
		displayObject.playFlag = this.playFlag;
		displayObject.loopFlag = this.loopFlag;
		displayObject.INITIALIZED = this.INITIALIZED;
		displayObject.PROGRAMMATICALLY_PLAYED = this.PROGRAMMATICALLY_PLAYED;
		displayObject.EXECUTING_AVM2_FRAME_SCRIPT =
			this.EXECUTING_AVM2_FRAME_SCRIPT;
		displayObject.LOOP_QUEUED = this.LOOP_QUEUED;
	};
	MovieClip.prototype.totalframes = function () {
		return this.staticData.totalframes;
	};
	MovieClip.prototype.framesloaded = function () {
		return this.staticData.preloadProgress.curPreloadFrame - 1;
	};
	MovieClip.prototype.movie = function () {
		return this.staticData.swf.movie;
	};
	MovieClip.prototype.currentFrame = function () {
		return this._currentFrame;
	};
	MovieClip.prototype.setCurrentFrame = function (frame) {
		this._currentFrame = frame;
	};
	MovieClip.prototype.isPlaying = function () {
		return this.playFlag;
	};
	MovieClip.prototype.setIsPlaying = function (bool) {
		this.playFlag = bool;
	};
	MovieClip.prototype.rawContainer = function () {
		return this.container;
	};
	MovieClip.prototype.getId = function () {
		return this.staticData.id;
	};
	MovieClip.prototype.postInstantiation = function (context, initObject, instantiatedBy, runFrame) {
		this.setDefaultInstanceName(context);
		context.avm1.addExecuteList(this);
	};
	MovieClip.prototype.preload = function (context, chunkLimit) {
		const staticData = this.staticData;
		const preloadProgress = staticData.preloadProgress;
		var nextPreloadChunk = preloadProgress.nextPreloadChunk;
		var curPreloadSymbol = preloadProgress.curPreloadSymbol;
		if (nextPreloadChunk < 0) return true;
		var g = staticData.swf.readFrom(nextPreloadChunk);
		if (curPreloadSymbol !== null) {
			var preloadSymbol = context.library.libraryForMovieMut(this.movie()).characterById(curPreloadSymbol);
			let sub_preload_done = preloadSymbol.preload(context, chunkLimit);
			if (sub_preload_done) {
				preloadProgress.curPreloadSymbol = null;
			}
		}
		let endTagFound = false;
		let subPreloadDone = preloadProgress.curPreloadSymbol === null;
		const tagCallback = function (reader, tagCode, tagLength) {
			switch (tagCode) {
				case 0:
					endTagFound = true;
					return true;
				case 1:
					preloadProgress.curPreloadFrame += 1;
					staticData.timelineTags.push("next");
					break;
				case 2:
					this.defineShape(context, reader, 1);
					break;
				case 22:
					this.defineShape(context, reader, 2);
					break;
				case 32:
					this.defineShape(context, reader, 3);
					break;
				case 83:
					this.defineShape(context, reader, 4);
					break;
				case 14:
					this.defineSound(context, reader, tagLength);
					break;
				case 46:
					this.defineMorphShape(context, reader, 1);
					break;
				case 84:
					this.defineMorphShape(context, reader, 2);
					break;
				case 11:
					this.defineText(context, reader, 1);
					break;
				case 33:
					this.defineText(context, reader, 2);
					break;
				case 10:
					this.defineFont(context, reader, 1, tagLength);
					break;
				case 48:
					this.defineFont(context, reader, 2, tagLength);
					break;
				case 75:
					this.defineFont(context, reader, 3, tagLength);
					break;
				case 91:
					this.defineFont(context, reader, 4, tagLength);
					break;
				case 37:
					this.defineEditText(context, reader);
					break;
				case 7:
					this.defineButton1(context, reader, tagLength);
					break;
				case 34:
					this.defineButton2(context, reader, tagLength);
					break;
				case 20:
					this.defineBitsLossless(context, reader, 1, tagLength);
					break;
				case 36:
					this.defineBitsLossless(context, reader, 2, tagLength);
					break;
				case 8:
					this.jpegTables(context, reader, tagLength);
					break;
				case 60:
					this.defineVideoStream(context, reader);
					break;
				case 61:
					this.preloadVideoFrame(context, reader, tagLength, chunkLimit);
					break;
				case 18:
					this.soundStreamHead(reader, staticData, 1);
					break;
				case 45:
					this.soundStreamHead(reader, staticData, 2);
					break;
				case 19:
					staticData.timelineTags.push([5, reader.parseSoundStreamBlock(tagLength).compressed]);
					break;
				case 6:
					this.defineBits(context, reader, 1, tagLength);
					break;
				case 21:
					this.defineBits(context, reader, 2, tagLength);
					break;
				case 35:
					this.defineBits(context, reader, 3, tagLength);
					break;
				case 90:
					this.defineBits(context, reader, 4, tagLength);
					break;
				case 4:
					staticData.timelineTags.push([1, reader.parsePlaceObject(1, tagLength),]);
					break;
				case 26:
					staticData.timelineTags.push([1, reader.parsePlaceObject(2, tagLength)]);
					break;
				case 70:
					staticData.timelineTags.push([1, reader.parsePlaceObject(3, tagLength),]);
					break;
				case 94:
					staticData.timelineTags.push([1, reader.parsePlaceObject(4, tagLength),]);
					break;
				case 5:
					staticData.timelineTags.push([2, reader.parseRemoveObject(1)]);
					break;
				case 28:
					staticData.timelineTags.push([2, reader.parseRemoveObject(2)]);
					break;
				case 15:
					staticData.timelineTags.push([3, reader.parseStartSound(1)]);
					break;
				case 9:
					staticData.timelineTags.push([4, reader.rgb()]);
					break;
				case 39:
					return this.defineSprite(context, reader, tagLength, chunkLimit);
			}
			if (chunkLimit.didOpsBreachLimit(context, tagLength)) {
				return true;
			}
			return false;
		};
		var result;
		if (subPreloadDone) {
			result = decodeTags(g, tagCallback.bind(this));
		} else {
			result = true;
		}
		if (subPreloadDone) {
			preloadProgress.nextPreloadChunk = g.input.position;
		}
		if (endTagFound) {
			if (staticData.audioStreamInfo) {
				staticData.audioStreamHandle = context.audio.loadStreamSound(staticData.audioStreamInfo, staticData.timelineTags);
			}
		}
		var is_finished = endTagFound;
		if (is_finished) {
			preloadProgress.nextPreloadChunk = -1;
		}
		return is_finished;
	};
	MovieClip.prototype.play = function (context) {
		if (this.totalframes() > 1) {
			this.playFlag = true;
		}
	};
	MovieClip.prototype.stop = function (context) {
		this.playFlag = false;
		this.stopAudioStream(context);
	};
	MovieClip.prototype.stopAudioStream = function (context) {
		if (this.audioStream) {
			context.audio.stopStreamSound(this.audioStream);
		}
	};
	MovieClip.prototype.getTotalBytes = function () {
		if (this.isRoot()) {
			return this.movie().uncompressedLength;
		} else {
			return this.tagStreamLen();
		}
	};
	MovieClip.prototype.getLoadedBytes = function () {
		if (this.staticData.preloadProgress.nextPreloadChunk < 0) {
			return this.getTotalBytes();
		} else {
			return this.staticData.preloadProgress.nextPreloadChunk;
		}
	};
	MovieClip.prototype.tagStreamLen = function () {
		return this.staticData.swf.end - this.staticData.swf.start;
	};
	MovieClip.prototype.runFrameAvm1 = function (context) {
		var isLoadFrame = !this.INITIALIZED;
		if (isLoadFrame) this.INITIALIZED = true;
		if (this.isPlaying()) this.runIntervalFrame(context, true, true);
	};
	MovieClip.prototype.determineNextFrame = function () {
		if (this.currentFrame() < this.totalframes()) {
			return "next";
		} else if (this.totalframes() > 1) {
			return "first";
		} else {
			return "same";
		}
	};
	MovieClip.prototype.setLoopQueued = function () {
		this.LOOP_QUEUED = true;
	};
	MovieClip.prototype.unsetLoopQueued = function () {
		this.LOOP_QUEUED = false;
	};
	MovieClip.prototype.gotoPlaceObject = function (context, place, gotoCommands, isRewind, index) {
		const depth = place.depth;
		const gotoPlace = new GotoPlaceObject(this._currentFrame, place, isRewind, index);
		for (let i = 0; i < gotoCommands.length; i++) {
			const gc = gotoCommands[i];
			if (gc.getDepth() == depth) {
				gc.merge(gotoPlace);
				return;
			}
		}
		gotoCommands.push(gotoPlace);
	};
	MovieClip.prototype.runIntervalFrame = function (context, runDisplayAction, runSounds) {
		const nextFrame = this.determineNextFrame();
		switch (nextFrame) {
			case "next":
				this._currentFrame++;
				break;
			case "first":
				this.runGoto(context, 1, true);
				return;
			case "same":
				this.stop(context);
				break;
		}
		let pos = this.tagStreamPos;
		while (pos < this.staticData.timelineTags.length) {
			let rTag = this.staticData.timelineTags[pos];
			if (rTag == "next") {
				pos++;
				break;
			}
			let typ = rTag[0];
			switch (typ) {
				case 1:
					if (runDisplayAction) this.placeObject(context, rTag[1]);
					break;
				case 2:
					if (runDisplayAction) this.removeObject(context, rTag[1]);
					break;
				case 3:
					if (runSounds) this.startSound1(context, rTag[1]);
					break;
				case 4:
					this.set_background_color(context, rTag[1])
					break;
				case 5:
					if (runSounds) this.soundStreamBlock(context, rTag[1]);
					break;
			}
			pos++;
		}
		this.tagStreamPos = pos;
		if (this.audioStream) {
			if (!context.audio.isSoundPlaying(this.audioStream)) {
				this.audioStream = null;
			}
		}
	};
	MovieClip.prototype.runGoto = function (context, frame, isImplicit) {
		let frameBeforeRewind = this.currentFrame();
		this.setSkipNextEnterFrame(false);
		let gotoCommands = [];
		this.stopAudioStream(context);
		let isRewind = frame <= this._currentFrame;
		if (isRewind) {
			this.tagStreamPos = 0;
			this._currentFrame = 0;
		}
		let fromFrame = this._currentFrame;
		if (isImplicit) this.setLoopQueued();
		let index = 0;
		let clamped_frame = frame;
		let pos = this.tagStreamPos;
		let frame_pos = pos;
		while (this._currentFrame < clamped_frame) {
			this._currentFrame++;
			frame_pos = pos;
			while (pos < this.staticData.timelineTags.length) {
				let rTag = this.staticData.timelineTags[pos];
				if (rTag == "next") {
					pos++;
					break;
				}
				let typ = rTag[0];
				switch (typ) {
					case 1:
						index++;
						this.gotoPlaceObject(context, rTag[1], gotoCommands, isRewind, index);
						break;
					case 2:
						this.gotoRemoveObject(context, rTag[1], gotoCommands, isRewind, fromFrame);
						break;
				}
				pos++;
			}
		}
		let hitTargetFrame = this._currentFrame == frame;
		if (isRewind) {
			let children = this.iterRenderList().filter(function (clip) {
				return clip.placeFrame() > frame;
			});
			for (let i = 0; i < children.length; i++) {
				let child = children[i];
				this.removeChild(context, child);
			}
		}
		let run_goto_command = (params) => {
			let child_entry = this.childByDepth(params.getDepth());
			let place = params.placeData;
			if (child_entry) {
				if ("characterId" in place) {
					child_entry.replaceWith(context, place.characterId);
					child_entry.applyPlaceObject(context, place);
					child_entry.setPlaceFrame(params.frame);
				} else {
					if (place.isMove) {
						child_entry.applyPlaceObject(context, place);
					}
				}
			} else {
				if ("characterId" in place) {
					let clip = this.instantiateChild(
						context,
						place.characterId,
						params.getDepth(),
						place
					);
					if (clip) clip.setPlaceFrame(params.frame);
				} else {
					console.log("Unexpected PlaceObject during goto", params);
					if (place.isMove) {
					}
				}
			}
		};
		gotoCommands.filter(function (params) {
			return params.frame < frame;
		}).forEach((goto) => {
			run_goto_command(goto);
		});
		if (hitTargetFrame) {
			this._currentFrame--;
			this.tagStreamPos = frame_pos;
			this.runIntervalFrame(context, false, frame != frameBeforeRewind);
		} else {
			this.setCurrentFrame(clamped_frame);
		}
		gotoCommands.filter(function (params) {
			return params.frame >= frame;
		}).forEach((goto) => {
			run_goto_command(goto);
		});
	};
	MovieClip.prototype.nextFrame = function (context) {
		if (this.currentFrame() < this.totalframes()) {
			this.gotoFrame(context, this.currentFrame() + 1, true);
		}
	};
	MovieClip.prototype.prevFrame = function (context) {
		if (this.currentFrame() > 1) {
			this.gotoFrame(context, this.currentFrame() - 1, true);
		}
	};
	MovieClip.prototype.gotoFrame = function (context, frame, stop) {
		if (stop) this.stop(context);
		else this.play(context);
		var _frame = Math.max(frame, 1);
		if (_frame != this.currentFrame()) {
			this.runGoto(context, _frame, false);
		}
	};
	MovieClip.prototype.gotoRemoveObject = function (context, place, gotoCommands, isRewind, fromFrame) {
		var depth = place.depth;
		for (let i = 0; i < gotoCommands.length; i++) {
			const gc = gotoCommands[i];
			if (gc.getDepth() == depth) {
				removeIdArray(gotoCommands, i);
				break;
			}
		}
		if (!isRewind) {
			let to_frame = this.currentFrame();
			this.setCurrentFrame(fromFrame);
			var child = this.childByDepth(depth);
			if (child) {
				this.removeChild(context, child);
			}
			this.setCurrentFrame(to_frame);
		}
	};
	MovieClip.prototype.instantiateChild = function (context, id, depth, place) {
		let child = context.library
			.libraryForMovieMut(this.movie())
			.instantiateById(id);
		if (child) {
			let prevChild = this.replaceAtDepth(context, depth, child);
			child.setInstantiatedByTimeline(true);
			child.setDepth(depth);
			child.setParent(context, this);
			child.setPlaceFrame(this.currentFrame());
			child.applyPlaceObject(context, place);
			if ("name" in place) {
				child.setName(place.name);
			}
			if ("clipDepth" in place) {
				child.setClipDepth(place.clipDepth);
			}
			if ("clipActions" in place) {
				//child.setClipEventHandlers(place.clipActions);
			}
			child.postInstantiation(context, null, "movie", false);
			child.enterFrame(context);
			child.runFrameAvm1(context);
		} else {
			console.log("Unable to instantiate display node id, reason being");
		}
		return child;
	};
	MovieClip.prototype.enterFrame = function (context) {
		let skipFrame = this.shouldSkipNextEnterFrame();
		var children = this.iterRenderList();
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (skipFrame) {
				child.setSkipNextEnterFrame(true);
			}
			child.enterFrame(context);
		}
		if (skipFrame) {
			this.setSkipNextEnterFrame(false);
		}
	};
	MovieClip.prototype.avm1Unload = function (context) {
		var children = this.iterRenderList();
		for (let i = 0; i < children.length; i++) {
			children[i].avm1Unload(context);
		}
		this.stopAudioStream(context);
		this.setAvm1Removed(true);
	};
	MovieClip.prototype.instantiate = function () {
		return new MovieClip(this);
	};
	
	// Preloading of definition tags
	MovieClip.prototype.defineSprite = function (context, reader, tagLength, chunkLimit) {
		const movie = this.movie();
		let id = reader.input.readUint16();
		let numFrames = reader.input.readUint16();
		let movieClip = MovieClip.createNewWithData(id, this.staticData.swf.resizeToReader(reader, tagLength - 4), numFrames);
		context.library.libraryForMovieMut(movie).registerCharacter(id, movieClip);
		this.staticData.preloadProgress.curPreloadSymbol = id;
		let should_exit = chunkLimit.didOpsBreachLimit(context, 4);
		if (should_exit) 
			return true;
		if (movieClip.preload(context, chunkLimit)) {
			this.staticData.preloadProgress.curPreloadSymbol = null;
			return false;
		} else {
			return true;
		}
	};
	MovieClip.prototype.defineShape = function (context, reader, version) {
		const movie = this.movie();
		let swfShape = reader.parseDefineShape(version);
		let id = swfShape.id;
		let graphic = Graphic.fromSwfTag(context, swfShape, movie);
		context.library.libraryForMovieMut(movie).registerCharacter(id, graphic);
	};
	MovieClip.prototype.defineMorphShape = function (context, reader, version) {
		const movie = this.movie();
		let tag = reader.parseDefineMorphShape(version);
		let id = tag.id;
		let morph_shape = MorphShape.fromSwfTag(tag, movie);
		context.library.libraryForMovieMut(movie).registerCharacter(id, morph_shape);
	};
	MovieClip.prototype.defineText = function (context, reader, version) {
		const movie = this.movie();
		let text = reader.parseDefineText(version);
		let textObject = StaticText.fromSwfTag(context, movie, text);
		context.library.libraryForMovieMut(movie).registerCharacter(text.id, textObject);
	};
	MovieClip.prototype.defineFont = function (context, reader, version, tagLength) {
		const movie = this.movie();
		let font;
		switch (version) {
			case 1:
				font = reader.parseDefineFont1(tagLength);
				break;
			case 2:
				font = reader.parseDefineFont2(2, tagLength);
				break;
			case 3:
				font = reader.parseDefineFont2(3, tagLength);
				break;
			case 4:
				font = reader.parseDefineFont4(tagLength);
				break;
		}
		let fontId = font.id;
		let fontObject = FlashFont.fromSwfTag(context.renderer, font);
		context.library.libraryForMovieMut(movie).registerCharacter(fontId, fontObject);
	};
	MovieClip.prototype.defineButton1 = function (context, reader, tagLength) {
		let swfButton = reader.parseDefineButton(1, tagLength);
		this.defineButtonAny(context, swfButton);
	};
	MovieClip.prototype.defineButton2 = function (context, reader, tagLength) {
		let swfButton = reader.parseDefineButton(2, tagLength);
		this.defineButtonAny(context, swfButton);
	};
	MovieClip.prototype.defineButtonAny = function (context, swfButton) {
		const movie = this.movie();
		let button = Avm1Button.fromSwfTag(swfButton, this.staticData.swf);
		let library = context.library.libraryForMovieMut(movie);
		library.registerCharacter(swfButton.id, button);
	};
	MovieClip.prototype.defineEditText = function (context, reader) {
		const movie = this.movie();
		let swf_edit_text = reader.parseDefineEditText();
		let edit_text = TextField.fromSwfTag(context, movie, swf_edit_text);
		let library = context.library.libraryForMovieMut(movie);
		library.registerCharacter(swf_edit_text.id, edit_text);
	};
	MovieClip.prototype.defineBitsLossless = function (context, reader, version, tagLength) {
		const movie = this.movie();
		let define_bits_lossless = reader.parseDefineBitsLossLess(
			version,
			tagLength
		);
		let bitmap = decodeDefineBitsLossless(define_bits_lossless);
		let imageInterval = context.renderer.createImageInterval();
		imageInterval.setImage(bitmap);
		let _bitmap = BitmapGraphic.createNew(
			context,
			define_bits_lossless.id,
			imageInterval
		);
		let library = context.library.libraryForMovieMut(movie);
		library.registerCharacter(define_bits_lossless.id, _bitmap);
	};
	MovieClip.prototype.jpegTables = function (context, reader, length) {
		const movie = this.movie();
		let jpeg_data = reader.input.readBytes(length);
		let library = context.library.libraryForMovieMut(movie);
		library.setJpegTables(jpeg_data);
	};
	MovieClip.prototype.defineBits = function (context, reader, version, length) {
		const movie = this.movie();
		let library = context.library.libraryForMovieMut(movie);
		let swfBits = reader.parseDefineBits(version, length);
		let jpeg_tables = version == 1 ? library.jpegTables : null;
		let jpeg_data = glueTablesToJpeg(new Uint8Array(swfBits.data), jpeg_tables);
		let imageInterval = context.renderer.createImageInterval();
		let _bitmap = BitmapGraphic.createNew(context, swfBits.id, imageInterval);
		library.registerCharacter(swfBits.id, _bitmap);
		decodeDefineBitsJpeg(jpeg_data, swfBits.alphaData, function (bitmap) {
			imageInterval.setImage(bitmap);
		});
	};
	MovieClip.prototype.defineVideoStream = function (context, reader) {
		const movie = this.movie();
		let streamdef = reader.parseDefineVideoStream();
		let id = streamdef.id;
		let video = DisplayVideoStream.fromSwfTag(movie, streamdef);
		let library = context.library.libraryForMovieMut(movie);
		library.registerCharacter(id, video);
	};
	MovieClip.prototype.preloadVideoFrame = function (context, reader, length, chunkLimit) {
		let vframe = reader.parseVideoFrame(length);
		const movie = this.movie();
		let library = context.library.libraryForMovieMut(movie);
		let v = library.characterById(vframe.streamId);
		if (v) v.preloadSwfFrame(vframe);
	};
	MovieClip.prototype.soundStreamHead = function (reader, staticData, version) {
		staticData.audioStreamInfo = reader.parseSoundStreamHead(version);
	};
	MovieClip.prototype.defineSound = function (context, reader, length) {
		const swfSound = reader.parseDefineSound(length);
		var library = context.library.libraryForMovieMut(this.movie());
		var handle = context.audio.registerSound(swfSound);
		library.registerCharacter(swfSound.id, handle);
	};
	MovieClip.prototype.showFrame = function () {};
	
	// Control tags
	MovieClip.prototype.doAction = function (context, tag) {};
	MovieClip.prototype.placeObject = function (context, place) {
		if ("characterId" in place) {
			if (place.isMove) {
				var child = this.childByDepth(place.depth);
				if (child) {
					child.replaceWith(context, place.characterId);
					child.applyPlaceObject(context, place);
					child.setPlaceFrame(this.currentFrame());
				}
			} else {
				this.instantiateChild(context, place.characterId, place.depth, place);
			}
		} else {
			if (place.isMove) {
				var child = this.childByDepth(place.depth);
				if (child) child.applyPlaceObject(context, place);
			}
		}
	};
	MovieClip.prototype.queuePlaceObject = function (context, tag) {};
	MovieClip.prototype.removeObject = function (context, tag) {
		var child = this.childByDepth(tag.depth);
		if (child) {
			this.removeChild(context, child);
		}
	};
	MovieClip.prototype.queueRemoveObject = function (context, tag) {};
	MovieClip.prototype.soundStreamBlock = function (context, block) {
		if (this.isPlaying() && this.staticData.audioStreamInfo && this.staticData.audioStreamHandle) {
			let audioStream = context.audio.startStream(this.staticData.audioStreamHandle, this, this._currentFrame, block, this.staticData.audioStreamInfo);
			this.audioStream = audioStream;
		}
	};
	MovieClip.prototype.startSound1 = function (context, tag) {
		var handle = context.library.libraryForMovie(this.movie()).characterById(tag.id);
		if (handle) {
			var soundInfo = tag.info;
			switch (soundInfo.event) {
				case "event":
					context.audio.startSound(handle, tag.info, this);
					break;
				case "start":
					if (!context.audio.isSoundPlayingWithHandle(handle)) 
						context.audio.startSound(handle, tag.info, this);
					break;
				case "stop":
					context.audio.stopSoundsWithHandle(handle);
					break;
			}
		}
	};
	MovieClip.prototype.set_background_color = function (context, background_color) {
		if (!context.stage.getBackgroundColor()) {
			context.stage.setBackgroundColor(background_color);
		}
	};
	
	const PreloadProgress = function () {
		this.nextPreloadChunk = 0;
		this.curPreloadFrame = 1;
		this.lastFrameStartPos = 0;
		this.curPreloadSymbol = null;
	};
	
	const MovieClipStatic = function () {
		this.id = 0;
		this.swf = null;
		this.totalframes = 0;
		this.exportedName = null;
		this.preloadProgress = new PreloadProgress();
		this.audioStreamInfo = null;
		this.audioStreamHandle = null;
		this.timelineTags = [];
	};
	MovieClipStatic.withData = function (id, swf, totalFrames) {
		var mcs = new MovieClipStatic();
		mcs.id = id;
		mcs.swf = swf;
		mcs.totalframes = totalFrames;
		return mcs;
	};

	const Avm1 = function () {
		this.clipExecList = null;
	};
	Avm1.prototype.runFrame = function (context) {
		var prev = null;
		var next = this.clipExecList;
		while (true) {
			var clip = next;
			if (!clip) break;
			next = clip.nextAvm1Clip();
			if (clip.avm1Removed()) {
				if (prev) {
					prev.setNextAvm1Clip(next);
				} else {
					this.clipExecList = next;
				}
				clip.setNextAvm1Clip(null);
			} else {
				clip.runFrameAvm1(context);
				prev = clip;
			}
		}
	};
	Avm1.prototype.addExecuteList = function (clip) {
		if (!clip.nextAvm1Clip()) {
			clip.setNextAvm1Clip(this.clipExecList);
			this.clipExecList = clip;
		}
	};

	const convertToMp3A = function (b, bufferMP3, seekSample) {
		var g = b.numberOfChannels,
			h = b.length,
			j = b.sampleRate,
			k = bufferMP3.sampleRate;
		var q = bufferMP3.getChannelData(0);
		var w = g == 2 ? bufferMP3.getChannelData(1) : null;
		var a = b.getChannelData(0);
		var s = g == 2 ? b.getChannelData(1) : null;
		for (let i = 0; i < h; i++) {
			let r = (((i + seekSample) / j) * k) | 0;
			a[i] = q[r] || 0;
			if (g == 2) s[i] = w[r] || 0;
		}
	};
	const RawDecoder = function (data, isStereo, is16Bit) {
		this.input = new ByteInput(data);
		this.isStereo = isStereo;
		this.is16Bit = is16Bit;
		this.l = 0;
		this.r = 0;
	};
	RawDecoder.prototype.readSample = function () {
		return this.is16Bit ? this.input.readInt16() / 32768 : (this.input.readUint8() - 128) / 128;
	};
	RawDecoder.prototype.next = function () {
		try {
			if (!this.isEnd) {
				let left = this.readSample(), right = this.isStereo ? this.readSample() : left;
				this.l = left, this.r = right;
			}
		} catch (e) {
			this.isEnd = true;
			this.l = 0;
			this.r = 0;
		}
	};
	const AdpcmDecoder = function (data, isStereo) {
		this.input = new ByteInput(data);
		this.channels = isStereo ? 2 : 1;
		this.c = [{}, {}];
		this.bits_per_sample = this.input.readUB(2) + 2;
		this.decoder = AdpcmDecoder.SAMPLE_DELTA_CALCULATOR[this.bits_per_sample - 2];
		this.l = 0;
		this.r = 0;
		this.isEnd = false;
		this.sample_num = 0;
	};
	AdpcmDecoder.INDEX_TABLE = [[-1, 2], [-1, -1, 2, 4], [-1, -1, -1, -1, 2, 4, 6, 8], [-1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 4, 6, 8, 10, 13, 16]];
	AdpcmDecoder.STEP_TABLE = [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767];
	AdpcmDecoder.SAMPLE_DELTA_CALCULATOR = [
		function (a, b) {
			let c = a >> 1;
			if (b & 1) c += a;
			return c;
		},
		function (a, b) {
			let c = a >> 2;
			if (b & 1) c += a >> 1;
			if (b & 2) c += a;
			return c;
		},
		function (a, b) {
			let c = a >> 3;
			if (b & 1) c += a >> 2;
			if (b & 2) c += a >> 1;
			if (b & 4) c += a;
			return c;
		},
		function (a, b) {
			let c = a >> 4;
			if (b & 1) c += a >> 3;
			if (b & 2) c += a >> 2;
			if (b & 4) c += a >> 1;
			if (b & 8) c += a;
			return c;
		},
	];
	AdpcmDecoder.prototype.next = function () {
		const j = this.input, m = this.bits_per_sample, d = this.decoder, _ = this.c, s = this.channels, h = 1 << (m - 1);
		try {
			if (!this.isEnd) {
				if (this.sample_num == 0) {
					for (let i = 0; i < s; i++) {
						let w = _[i];
						w.sample = j.readSB(16);
						w.stepIndex = j.readUB(6);
					}
				}
				this.sample_num = (this.sample_num + 1) % 4095;
				for (let i2 = 0; i2 < s; i2++) {
					let w = _[i2];
					let r = AdpcmDecoder.STEP_TABLE[w.stepIndex];
					let p = j.readUB(m);
					let g = p & (h - 1);
					let delta = d(r, g);
					w.sample = Math.max( -32768, Math.min(32767, w.sample + (p & h ? 0 - delta : delta)));
					w.stepIndex = Math.max(0, Math.min(88, w.stepIndex + AdpcmDecoder.INDEX_TABLE[m - 2][g]));
				}
				this.l = _[0].sample / 0x8000;
				this.r = s == 2 ? _[1].sample / 0x8000 : this.l;
			}
		} catch (e) {
			this.isEnd = true;
			this.l = 0;
			this.r = 0;
		}
	};
	function decodePCM(data, buffer, channels, is16Bit, pos_buffer, sample_length) {
		const raw = new RawDecoder(data, channels == 2, is16Bit);
		var _pos_buffer = pos_buffer || 0;
		var i = _pos_buffer;
		var a = buffer.getChannelData(0);
		var s = channels == 2 ? buffer.getChannelData(1) : null;
		while (i - _pos_buffer < sample_length) {
			raw.next();
			a[i] = raw.l;
			if (channels == 2) s[i] = raw.r;
			i++;
		}
		return i;
	}
	function decodeADPCM(data, buffer, channels, pos_buffer, sample_length) {
		const adpcm = new AdpcmDecoder(data, channels == 2);
		var _ = pos_buffer || 0;
		var q = _;
		let a = buffer.getChannelData(0);
		let s = channels == 2 ? buffer.getChannelData(1) : null;
		while (q - _ < sample_length) {
			adpcm.next();
			a[q] = adpcm.l;
			if (channels == 2) s[q] = adpcm.r;
			q++;
		}
		return q;
	}
	function decodeMP3(audioContext, data, buffer) {
		var byteStream = new ByteInput(data);
		var seekSample = byteStream.readInt16();
		var mp3data = data.slice(2);
		audioContext.decodeAudioData(
			mp3data,
			function (f) {
				convertToMp3A(buffer, f, seekSample);
			},
			function () {}
		);
	}
	function decodeMP3SoundStream(audioContext, blocks, streamInfo, buffer) {
		var gg1 = 0;
		for (var i = 0; i < blocks.length; i++) gg1 += blocks[i].byteLength - 4;
		var gg = new Uint8Array(gg1);
		var idd = 0;
		for (var i = 0; i < blocks.length; i++) {
			var ui8view = new Uint8Array(blocks[i], 4);
			gg.set(ui8view, idd);
			idd += ui8view.length;
		}
		var compressed = gg.buffer;
		if (compressed.byteLength) {
			audioContext.decodeAudioData(
				compressed,
				function (f) {
					convertToMp3A(buffer, f, streamInfo.latencySeek || 0);
				},
				function (e) {}
			);
		}
	}
	function decodeNellymoser(b, a) {
		var z = 0, x = new Float32Array(128), r = 0, k = a.getChannelData(0), c = new Float32Array(256);
		while (r < b.byteLength) {
			AT_Nellymoser_Decoder.decode(x, new Uint8Array(b.slice(r, r + 64)), c);
			for (let i = 0; i < 256; i++) (k[z] = c[i] / 32768), z++;
			r += 64;
		}
	}
	function loadDefineSound(audioContext, sound) {
		var format = sound.format;
		var data = sound.data;
		var numSamples = sound.numSamples;
		var channels = format.isStereo ? 2 : 1;
		var is16Bit = format.is16Bit;
		var buffer = audioContext.createBuffer(channels, numSamples, format.sampleRate);
		switch (format.compression) {
			case "ADPCM":
				decodeADPCM(data, buffer, channels, 0, numSamples);
				break;
			case "uncompressed":
			case "uncompressedUnknownEndian":
				decodePCM(data, buffer, channels, is16Bit, 0, numSamples);
				break;
			case "MP3":
				decodeMP3(audioContext, data, buffer);
				break;
			case "nellymoser":
				decodeNellymoser(data, buffer);
				break;
			default:
				console.log("TODO: " + format.compression);
		}
		return buffer;
	}
	function getMP3Sample(blocks) {
		var s = 0;
		for (let i = 0; i < blocks.length; i++) {
			const block = blocks[i];
			var _in = new ByteInput(block);
			s += _in.readUint16();
		}
		return s;
	}
	function loadStreamSound(audioContext, blocks, streamInfo) {
		var streamStream = streamInfo.stream;
		var compression = streamStream.compression;
		var samplePerBlock = streamInfo.samplePerBlock;
		var numSamples = blocks.length * streamInfo.samplePerBlock;
		var channels = streamStream.isStereo ? 2 : 1;
		var is16Bit = streamStream.is16Bit;
		var buffer = audioContext.createBuffer(channels, numSamples, streamStream.sampleRate);
		if (compression == "MP3") {
			decodeMP3SoundStream(audioContext, blocks, streamInfo, buffer);
		} else {
			if (compression == "nellymoser") {
				var gg1 = 0;
				for (var i = 0; i < blocks.length; i++) gg1 += blocks[i].byteLength;
				var gg = new Uint8Array(gg1);
				var idd = 0;
				for (var i = 0; i < blocks.length; i++) {
					var ui8view = new Uint8Array(blocks[i]);
					gg.set(ui8view, idd);
					idd += ui8view.length;
				}
				var compressed = gg.buffer;
				decodeNellymoser(compressed, buffer);
			} else {
				var oPos = 0;
				for (let i = 0; i < blocks.length; i++) {
					const block = blocks[i];
					var posBuffer = 0;
					switch (compression) {
						case "ADPCM":
							posBuffer = decodeADPCM(block, buffer, channels, oPos, samplePerBlock);
							break;
						case "uncompressed":
						case "uncompressedUnknownEndian":
							posBuffer = decodePCM(block, buffer, channels, is16Bit, oPos, samplePerBlock);
							break;
						default:
							console.log("TODO: " + compression);
					}
					oPos = posBuffer;
				}
			}
		}
		return buffer;
	}
	function loadStreamSoundTimeline(audioContext, tags, streamInfo) {
		var streamSounds = [];
		var blocks = [];
		var frameCount = 0;
		var startFrame = 0;
		var streamBlock = null;
		var tagId = 0;
		while (tagId < tags.length) {
			var tag = tags[tagId++];
			if (tag == "next") {
				frameCount++;
				if (streamBlock) {
					if (!blocks.length) startFrame = frameCount;
					blocks.push(streamBlock);
					streamBlock = null;
				} else {
					if (blocks.length) {
						streamSounds.push({
							startFrame,
							blocks,
						});
						blocks = [];
					}
				}
			} else {
				if (tag[0] == 5) streamBlock = tag[1];
			}
		}
		if (blocks.length) {
			streamSounds.push({
				startFrame,
				blocks,
			});
			blocks = [];
		}
		var buffers = [];
		var s = 0;
		if (streamSounds.length) {
			for (let l = 0; l < streamSounds.length; l++) {
				var currentStreamSound = streamSounds[l];
				var buffer = loadStreamSound(audioContext, currentStreamSound.blocks, streamInfo);
				buffers.push({
					blocks: currentStreamSound.blocks,
					buffer: buffer,
					startFrame: s,
				});
				s += currentStreamSound.blocks.length;
			}
		}
		return buffers;
	}

	const Sound = function (buffer, format) {
		this.buffer = buffer;
		this.format = format;
	};
	Sound.prototype.getBuffer = function () {
		return this.buffer;
	};
	const SoundStream = function (streamSounds, streamInfo) {
		this.streamSounds = streamSounds;
		this.format = streamInfo;
	};
	SoundStream.prototype.getBlock = function (block) {
		for (let i = 0; i < this.streamSounds.length; i++) {
			const sg = this.streamSounds[i];
			for (let j = 0; j < sg.blocks.length; j++) {
				const _block = sg.blocks[j];
				if (_block == block) {
					return {
						buffer: sg.buffer,
						blocks: sg.blocks,
						timeFrame: j,
					};
				}
			}
		}
		return null;
	};
	const AudioBackend = function () {
		this.audioContext = new AudioContext();
		this.playingAudios = [];
		this.node = this.audioContext.createGain();
		this.node.gain.value = 1;
		this.node.connect(this.audioContext.destination);
		this.frameRate = 6;
		this.compressSoundMap = {};
	};
	AudioBackend.prototype.getCompressSound = function () {
		return Object.keys(this.compressSoundMap);
	};
	AudioBackend.prototype.play = function () {
		this.audioContext.resume();
	};
	AudioBackend.prototype.pause = function () {
		this.audioContext.suspend();
	};
	AudioBackend.prototype.getAudioBufferFloat = function (bufferLeft, bufferRight, sampleRate) {
		bufferLeft.fill(0);
		bufferRight.fill(0);
		var oe = Math.floor((this.audioContext.currentTime * sampleRate) / 2048) * 2048;
		var ea = oe / sampleRate;
		for (let i = 0; i < this.playingAudios.length; i++) {
			const playingAudio = this.playingAudios[i];
			if (playingAudio.ended) break;
			var buf = playingAudio.buffer;
			var _l = buf.getChannelData(0);
			var _r = buf.numberOfChannels == 2 ? buf.getChannelData(0) : _l;
			var hs = this.getAudioNodeVolume(playingAudio);
			for (let i2 = 0; i2 < 2048; i2++) {
				var st = ((playingAudio.timeFrame || 0) + ea - playingAudio.startTime) * buf.sampleRate;
				var _i = (st + i2 * (buf.sampleRate / sampleRate)) | 0;
				bufferLeft[i2] += (_l[_i] || 0) * hs[0];
				bufferRight[i2] += (_r[_i] || 0) * hs[1];
			}
		}
		return oe;
	};
	AudioBackend.prototype._createPan = function (input) {
		var inputNode = this.audioContext.createGain();
		var leftGain = this.audioContext.createGain();
		var rightGain = this.audioContext.createGain();
		var channelMerger = this.audioContext.createChannelMerger(2);
		inputNode.connect(leftGain);
		inputNode.connect(rightGain);
		leftGain.connect(channelMerger, 0, 0);
		rightGain.connect(channelMerger, 0, 1);
		channelMerger.connect(input);
		return { inputNode, leftGain, rightGain };
	};
	AudioBackend.prototype.tick = function () {
		for (let i = 0; i < this.playingAudios.length; i++) {
			const playingAudio = this.playingAudios[i];
			if (playingAudio.type == "start_sound") {
				this.tickPlayingAudio(playingAudio);
			} else if (playingAudio.type == "stream_sound") {
				this.tickPlayingSoundStream(playingAudio);
			}
		}
		var newList = [];
		for (let i = 0; i < this.playingAudios.length; i++) {
			const playingAudio = this.playingAudios[i];
			if (!playingAudio.ended) newList.push(playingAudio);
		}
		this.playingAudios = newList;
	};
	AudioBackend.prototype.tickPlayingAudio = function (playingAudio) {
		if (playingAudio.ended) return;
		var SGFtime = this.audioContext.currentTime - playingAudio.startTime;
		var SGFtime2 = this.audioContext.currentTime - playingAudio.startTimeOriginal;
		var envelopes = playingAudio.envelopes;
		if (envelopes) {
			var nodeLR = playingAudio.nodeLR;
			if (playingAudio.envelopeId < envelopes.length) {
				var rs = envelopes[playingAudio.envelopeId];
				var rs2 = envelopes[playingAudio.envelopeId - 1];
				if (rs2) {
					const per = Math.max(Math.min((SGFtime2 * 44100 - rs2.sample) / (rs.sample - rs2.sample), 1), 0);
					const startPer = 1 - per;
					const leftVal = (rs2.leftVolume * startPer + rs.leftVolume * per) / 32768;
					const rightVal = (rs2.rightVolume * startPer + rs.rightVolume * per) / 32768;
					nodeLR.rightGain.gain.value = Math.max(Math.min(rightVal, 1), 0);
					nodeLR.leftGain.gain.value = Math.max(Math.min(leftVal, 1), 0);
				}
				if (SGFtime2 >= rs.sample / 44100) {
					const leftVal = rs.leftVolume / 32768;
					const rightVal = rs.rightVolume / 32768;
					nodeLR.rightGain.gain.value = Math.max(Math.min(rightVal, 1), 0);
					nodeLR.leftGain.gain.value = Math.max(Math.min(leftVal, 1), 0);
					playingAudio.envelopeId++;
				}
			}
		}
		if (SGFtime + playingAudio.soundStart > playingAudio.soundEnd) {
			playingAudio.loopCount--;
			if (playingAudio.loopCount) {
				playingAudio.startTime = this.audioContext.currentTime;
				this.playSound(playingAudio);
			} else {
				this.stopSound(playingAudio);
			}
		} else {
			//this.playSound(playingAudio);
		}
	};
	AudioBackend.prototype.tickPlayingSoundStream = function (playingaudio) {
		if (!playingaudio.ended) {
			if (this.streamSoundIsEnded(playingaudio)) {
				this.stopStreamSound(playingaudio);
			} else {
				//this.playStreamSound(playingaudio);
			}
		} else {
		}
	};
	AudioBackend.prototype.getAudioNodeVolume = function (n) {
		var l = 0;
		var r = 0;
		var nodeLR = n.nodeLR;
		if (nodeLR) {
			l = nodeLR.rightGain.gain.value;
			r = nodeLR.leftGain.gain.value;
		} else {
			l = 1;
			r = 1;
		}
		return [l, r];
	};
	AudioBackend.prototype.streamSoundIsEnded = function (a) {
		return (
			a.timeFrame + (this.audioContext.currentTime - a.startTime) >= a.duration
		);
	};
	AudioBackend.prototype.cleanup = function () {
		this.stopAllSounds(true);
	};
	AudioBackend.prototype.setFrameRate = function (frameRate) {
		this.frameRate = frameRate;
	};
	AudioBackend.prototype.stopAllSounds = function (stop) {
		for (let i = 0; i < this.playingAudios.length; i++) {
			const playingAudio = this.playingAudios[i];
			this.stopSound(playingAudio);
		}
	};
	AudioBackend.prototype.isSoundPlaying = function (soundplaying) {
		return !soundplaying.ended;
	};
	AudioBackend.prototype.isSoundPlayingWithHandle = function (handle) {
		for (let i = 0; i < this.playingAudios.length; i++) {
			const playingAudio = this.playingAudios[i];
			if (playingAudio.type == "start_sound") {
				if (handle === playingAudio.sound) return !playingAudio.ended;
			}
		}
		return false;
	};
	AudioBackend.prototype.stopSoundsWithHandle = function (handle) {
		for (let i = 0; i < this.playingAudios.length; i++) {
			const playingAudio = this.playingAudios[i];
			if (playingAudio.type == "start_sound") {
				if (handle === playingAudio.sound) this.stopSound(playingAudio);
			}
		}
	};
	AudioBackend.prototype.stopSound = function (soundPlaying) {
		if (soundPlaying.source) soundPlaying.source.disconnect();
		soundPlaying.source = null;
		soundPlaying.ended = true;
	};
	AudioBackend.prototype.playSound = function (soundPlaying) {
		if (soundPlaying.source) soundPlaying.source.disconnect();
		var source = this.audioContext.createBufferSource();
		source.buffer = soundPlaying.buffer;
		if (soundPlaying.nodeLR) source.connect(soundPlaying.nodeLR.inputNode);
		else source.connect(this.node);
		var s = soundPlaying.soundStart + (this.audioContext.currentTime - soundPlaying.startTime);
		//source.loop = true;
		//source.loopStart = s;
		//source.loopEnd = s + 0.25;
		source.start(this.audioContext.currentTime, s);
		soundPlaying.source = source;
	};
	AudioBackend.prototype.startSound = function (sound, soundInfo, mc) {
		var sp = {};
		sp.sound = sound;
		sp.type = "start_sound";
		sp.ended = false;
		sp.startTime = this.audioContext.currentTime;
		sp.startTimeOriginal = this.audioContext.currentTime;
		sp.buffer = sound.getBuffer();
		var nodeLR = this._createPan(this.node);
		sp.nodeLR = nodeLR;
		sp.soundStart = 0;
		sp.soundEnd = sp.buffer.duration;
		sp.loopCount = 1;
		if ("numLoops" in soundInfo) sp.loopCount = soundInfo.numLoops;
		if ("inSample" in soundInfo) sp.soundStart = soundInfo.inSample / 44100;
		if ("outSample" in soundInfo) sp.soundEnd = soundInfo.outSample / 44100;
		if ("envelope" in soundInfo) {
			sp.envelopeId = 0;
			var envelopes = soundInfo.envelope;
			var rs = envelopes[0];
			if (rs) {
				const leftVal = rs.leftVolume / 32768;
				const rightVal = rs.rightVolume / 32768;
				nodeLR.rightGain.gain.value = Math.max(Math.min(rightVal, 1), 0);
				nodeLR.leftGain.gain.value = Math.max(Math.min(leftVal, 1), 0);
			}
			sp.envelopes = envelopes;
		}
		this.playSound(sp);
		this.playingAudios.push(sp);
	};
	AudioBackend.prototype.startStream = function (audioStreamHandle, clip, clipFrame, block, streamInfo) {
		var result = audioStreamHandle.getBlock(block);
		if (!result) return;
		var rate = +(1000 / this.frameRate).toFixed(1);
		var durations = result.buffer.duration;
		var timeFrame = (result.timeFrame * rate) / 1000;
		var audioStream = clip.audioStream;
		if (audioStream) {
			if (!audioStream.ended) {
				var isS = (Math.abs((this.audioContext.currentTime - audioStream.startTime) - (timeFrame - audioStream.timeFrame)) > 0.15);
				if ((audioStream.blocks !== result.blocks) || isS) {
					audioStream.blocksInfo = result;
					audioStream.blocks = result.blocks;
					audioStream.buffer = result.buffer;
					audioStream.timeFrame = timeFrame;
					audioStream.duration = durations;
					audioStream.startTime = this.audioContext.currentTime;
					this.playStreamSound(audioStream);
				}
			}
			return audioStream;
		}
		var sp = {};
		sp.sound = audioStreamHandle;
		sp.type = "stream_sound";
		sp.ended = false;
		sp.blocksInfo = result;
		sp.blocks = result.blocks;
		sp.buffer = result.buffer;
		sp.timeFrame = timeFrame;
		sp.duration = durations;
		sp.startTime = this.audioContext.currentTime;
		this.playStreamSound(sp);
		this.playingAudios.push(sp);
		return sp;
	};
	AudioBackend.prototype.playStreamSound = function (soundPlaying) {
		if (soundPlaying.source) soundPlaying.source.disconnect();
		var source = this.audioContext.createBufferSource();
		source.buffer = soundPlaying.buffer;
		source.connect(this.node);
		var timeFrame = soundPlaying.timeFrame;
		var s = timeFrame + (this.audioContext.currentTime - soundPlaying.startTime);
		//source.loop = true;
		//source.loopStart = s;
		//source.loopEnd = s + 0.25;
		source.start(this.audioContext.currentTime, s);
		soundPlaying.source = source;
	};
	AudioBackend.prototype.stopStreamSound = function (sound) {
		if (sound.source) sound.source.disconnect();
		sound.source = null;
		sound.ended = true;
	};
	AudioBackend.prototype.getVolume = function () {
		return this.node.gain.value;
	};
	AudioBackend.prototype.setVolume = function (value) {
		this.node.gain.value = value;
	};
	AudioBackend.prototype.registerSound = function (sound) {
		this.compressSoundMap[sound.format.compression] = true;
		var buffer = loadDefineSound(this.audioContext, sound);
		return new Sound(buffer, sound.format);
	};
	AudioBackend.prototype.loadStreamSound = function (streamInfo, tags) {
		if (streamInfo.stream.compression != "uncompressedUnknownEndian") 
			this.compressSoundMap[streamInfo.stream.compression] = true;
		var buffer = loadStreamSoundTimeline(this.audioContext, tags, streamInfo);
		return new SoundStream(buffer, streamInfo);
	};

	const Bitmap = function(width, height, format, data) {
		this.width = width;
		this.height = height;
		this.format = format;
		this.data = data;
	}
	Bitmap.prototype.toRGBA = function() {
		var width = this.width;
		var height = this.height;
		switch (this.format) {
			case "yuv420p":
			case "yuva420p":
				var isAlpha = this.format == "yuva420p";
				var chroma_width = (((width + 1) / 2) | 0);
				var chroma_height = (((height + 1) / 2) | 0);
				var yuv = this.data;
				var data = new Uint8Array((width * height) * 4);
				var yOffset = 0;
				var uOffset = width * height;
				var vOffset = uOffset + (chroma_width * chroma_height);
				var aOffset = uOffset + (chroma_width * chroma_height) + (chroma_width * chroma_height);
				for (var h = 0; h < height; h++) {
					for (var w = 0; w < width; w++) {
						var ypos = w + h * width + yOffset;
						var upos = (w >> 1) + (h >> 1) * chroma_width + (uOffset);
						var vpos = (w >> 1) + (h >> 1) * chroma_width + (vOffset);
						var Y = yuv[ypos] - 16;
						var U = yuv[upos] - 128;
						var V = yuv[vpos] - 128;
						var R = (1.164 * Y + 1.596 * V);
						var G = (1.164 * Y - 0.813 * V - 0.391 * U);
						var B = (1.164 * Y + 2.018 * U);
						var outputData_pos = w * 4 + width * h * 4;
						data[0 + outputData_pos] = Math.max(Math.min(R, 255), 0);
						data[1 + outputData_pos] = Math.max(Math.min(G, 255), 0);
						data[2 + outputData_pos] = Math.max(Math.min(B, 255), 0);
						data[3 + outputData_pos] = isAlpha ? yuv[w + h * width + aOffset] : 255;
					}
				}
				this.data = data;
				break;
		}
	}

	const TransformStack = function () {
		this.stackMt = [[1, 0, 0, 1, 0, 0]];
		this.stackCT = [[1, 1, 1, 1, 0, 0, 0, 0]];
		this.pushTotal = 1;
	};
	TransformStack.prototype.stackPush = function (matrix, colorTransform) {
		this.stackMt.push(multiplicationMatrix(this.getMatrix(), matrix));
		this.stackCT.push(
			multiplicationColor(this.getColorTransform(), colorTransform)
		);
		if (this.stackCT.length > this.pushTotal) {
			this.pushTotal = this.stackCT.length;
		}
	};
	TransformStack.prototype.stackPop = function () {
		this.stackMt.pop();
		this.stackCT.pop();
	};
	TransformStack.prototype.getMatrix = function () {
		return this.stackMt[this.stackMt.length - 1];
	};
	TransformStack.prototype.getColorTransform = function () {
		return this.stackCT[this.stackCT.length - 1];
	};
	TransformStack.prototype.setMatrix = function (matrix) {
		this.stackMt = [matrix];
	};
	TransformStack.prototype.setColorTransform = function (colorTransform) {
		this.stackCT = [colorTransform];
	};

	const CommandList = function () {
		this.commandLists = [];
		this.maskersInProgress = 0;
	};
	CommandList.prototype.execute = function (renderer) {
		for (let i = 0; i < this.commandLists.length; i++) {
			const tsd = this.commandLists[i];
			switch (tsd[0]) {
				case "render_shape":
					renderer.renderShape(tsd[1], tsd[2], tsd[3]);
					break;
				case "render_bitmap":
					renderer.renderBitmap(tsd[1], tsd[2], tsd[3], tsd[4]);
					break;
				case "push_mask":
					renderer.pushMask();
					break;
				case "pop_mask":
					renderer.popMask();
					break;
				case "activate_mask":
					renderer.activateMask();
					break;
				case "deactivate_mask":
					renderer.deactivateMask();
					break;
				case "blend":
					renderer.blend(tsd[1], tsd[2]);
					break;
			}
		}
	};
	CommandList.prototype.drawingMask = function () {
		return this.maskersInProgress > 0;
	};
	CommandList.prototype.clear = function () {
		this.commandLists = [];
	};
	CommandList.prototype.copy = function () {
		var clone = new CommandList();
		clone.commandLists = this.commandLists.slice(0);
		return clone;
	};
	CommandList.prototype.replace = function (commands) {
		this.commandLists = commands.commandLists.slice(0);
	};
	CommandList.prototype.renderShape = function (shape, transfrom, colorT) {
		if (this.maskersInProgress <= 1)
			this.commandLists.push([
				"render_shape",
				shape,
				transfrom.slice(0),
				colorT.slice(0),
			]);
	};
	CommandList.prototype.renderBitmap = function (
		bitmap,
		transfrom,
		colorT,
		isSmoothed
	) {
		if (this.maskersInProgress <= 1)
			this.commandLists.push([
				"render_bitmap",
				bitmap,
				transfrom.slice(0),
				colorT.slice(0),
				isSmoothed,
			]);
	};
	CommandList.prototype.pushMask = function () {
		if (this.maskersInProgress == 0) this.commandLists.push(["push_mask"]);
		this.maskersInProgress += 1;
	};
	CommandList.prototype.activateMask = function () {
		this.maskersInProgress -= 1;
		if (this.maskersInProgress == 0) this.commandLists.push(["activate_mask"]);
	};
	CommandList.prototype.deactivateMask = function () {
		if (this.maskersInProgress == 0)
			this.commandLists.push(["deactivate_mask"]);
		this.maskersInProgress += 1;
	};
	CommandList.prototype.popMask = function () {
		this.maskersInProgress -= 1;
		if (this.maskersInProgress == 0) this.commandLists.push(["pop_mask"]);
	};
	CommandList.prototype.blend = function (commands, blendMode) {
		this.commandLists.push(["blend", commands, blendMode]);
	};

	function linearGradientXY(m) {
		var x0 = -16384 * m[0] - 16384 * m[2] + m[4];
		var x1 = 16384 * m[0] - 16384 * m[2] + m[4];
		var x2 = -16384 * m[0] + 16384 * m[2] + m[4];
		var y0 = -16384 * m[1] - 16384 * m[3] + m[5];
		var y1 = 16384 * m[1] - 16384 * m[3] + m[5];
		var y2 = -16384 * m[1] + 16384 * m[3] + m[5];
		var vx2 = x2 - x0;
		var vy2 = y2 - y0;
		var r1 = Math.sqrt(vx2 * vx2 + vy2 * vy2);
		vx2 /= r1;
		vy2 /= r1;
		var r2 = (x1 - x0) * vx2 + (y1 - y0) * vy2;
		return [x0 + r2 * vx2, y0 + r2 * vy2, x1, y1];
	}
	function checkImageColorTransform(colorTransform) {
		return (colorTransform[0] !== 1 || colorTransform[1] !== 1 || colorTransform[2] !== 1 || colorTransform[4] || colorTransform[5] || colorTransform[6]);
	}
	
	function sameBlendMode(first, second) {
		return first == second;
	}
	
	const RenderCanvas2dTexture = function (renderer) {
		this.renderer = renderer;
		this.width = 0;
		this.height = 0;
		this.texture = null;
		this.isDrawing = false;
		this.isColorTransformCache = false;
		this.c = [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];
	};
	RenderCanvas2dTexture.prototype._initColorTransformCache = function () {
		this.tmpCanvas = document.createElement("canvas");
		this.tmpCtx = this.tmpCanvas.getContext("2d");
		this.isColorTransformCache = true;
	};
	RenderCanvas2dTexture.prototype.getTexture = function (color) {
		if (color && checkImageColorTransform(color)) {
			if (!this.isColorTransformCache) this._initColorTransformCache();
			if (this.c[0] != color[0] || this.c[1] != color[1] || this.c[2] != color[2] || this.c[3] != color[3] || this.c[4] != color[4] || this.c[5] != color[5] || this.c[6] != color[6] || this.c[7] != color[7]) {
				var width = this.texture.width;
				var height = this.texture.height;
				this.tmpCanvas.width = width;
				this.tmpCanvas.height = height;
				this.tmpCtx.drawImage(this.texture, 0, 0);
				var imgData = this.tmpCtx.getImageData(0, 0, width, height);
				var pxData = imgData.data;
				var idx = 0;
				var RedMultiTerm = color[0];
				var GreenMultiTerm = color[1];
				var BlueMultiTerm = color[2];
				var AlphaMultiTerm = color[3];
				var RedAddTerm = color[4];
				var GreenAddTerm = color[5];
				var BlueAddTerm = color[6];
				var AlphaAddTerm = color[7];
				var length = width * height;
				if (length > 0) {
					while (length--) {
						var R = pxData[idx++];
						var G = pxData[idx++];
						var B = pxData[idx++];
						var A = pxData[idx++];
						pxData[idx - 4] =
							Math.max(0, Math.min(R * RedMultiTerm + RedAddTerm, 255)) | 0;
						pxData[idx - 3] =
							Math.max(0, Math.min(G * GreenMultiTerm + GreenAddTerm, 255)) | 0;
						pxData[idx - 2] =
							Math.max(0, Math.min(B * BlueMultiTerm + BlueAddTerm, 255)) | 0;
						pxData[idx - 1] = Math.max(
							0,
							Math.min(A * AlphaMultiTerm + AlphaAddTerm, 255)
						);
					}
				}
				this.tmpCtx.putImageData(imgData, 0, 0);
				this.c[0] = color[0];
				this.c[1] = color[1];
				this.c[2] = color[2];
				this.c[3] = color[3];
				this.c[4] = color[4];
				this.c[5] = color[5];
				this.c[6] = color[6];
				this.c[7] = color[7];
			}
			return this.tmpCanvas;
		} else {
			return this.texture;
		}
	};
	RenderCanvas2dTexture.prototype.setImage = function (image) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		canvas.width = image.width;
		canvas.height = image.height;
		this.width = image.width;
		this.height = image.height;
		ctx.drawImage(image, 0, 0);
		this.texture = canvas;
		this.isDrawing = true;
		this.c = [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];
		this.isColorTransformCache = false;
	};
	const RenderCanvas2dShapeInterval = function (renderer, shapeIntervalData) {
		this.renderer = renderer;
		this.shapeIntervalData = shapeIntervalData;
	};
	const RenderCanvas2d = function () {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.quality = "high";
		this.width = 640;
		this.height = 480;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.matrixTransform = [1, 0, 0, 1, 0, 0];
		this.colorTransform = [1, 1, 1, 1, 0, 0, 0, 0];
		this.maskState = 0;
		this.blendModes = ["normal"];
		this.tmpCanvas = document.createElement("canvas");
		this.tmpCtx = this.tmpCanvas.getContext("2d");
	};
	RenderCanvas2d.prototype.setQuality = function (quality) {
		this.quality = quality;
	};
	RenderCanvas2d.prototype.submitFrame = function (clear, commands) {
		this.beginFrame(clear);
		commands.execute(this);
	};
	RenderCanvas2d.prototype.applyBlendMode = function (blendMode) {
		var mode = 'source-over';
		switch(blendMode) {
			case "multiply":
				mode = 'multiply';
				break;
			case "screen":
				mode = 'screen';
				break;
			case "lighten":
				mode = 'lighten';
				break;
			case "darken":
				mode = 'darken';
				break;
			case "difference":
			case "subtract":
				mode = 'difference';
				break;
			case "add":
				mode = 'lighter';
				break;
			case "overlay":
				mode = 'overlay';
				break;
			case "hardlight":
				mode = 'hard-light';
				break;
		}
		this.ctx.globalCompositeOperation = mode;
	};
	RenderCanvas2d.prototype.beginFrame = function (clear) {
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.setColorTransform(1, 1, 1, 1, 0, 0, 0, 0);
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		var css = "rgba(" + clear.join(",") + ")";
		this.ctx.fillStyle = css;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	};
	RenderCanvas2d.prototype.destroy = function () {};
	RenderCanvas2d.prototype.resize = function (w, h) {
		this.width = w;
		this.height = h;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
	};
	RenderCanvas2d.prototype.createImageInterval = function () {
		return new RenderCanvas2dTexture(this);
	};
	RenderCanvas2d.prototype.isAllowImageColorTransform = function () {
		return this.quality == "high";
	};
	RenderCanvas2d.prototype.setColorTransform = function (a, b, c, d, e, f, x, y) {
		this.colorTransform = [a, b, c, d, e, f, x, y];
	};
	RenderCanvas2d.prototype.setTransform = function (a, b, c, d, e, f) {
		this.matrixTransform = [a, b, c, d, e, f];
	};
	RenderCanvas2d.prototype.buildCmd2dPath = function (cmd) {
		var str = "";
		for (let i = 0; i < cmd.length; i++) {
			const a = cmd[i];
			switch (a[0]) {
				case 0:
					str += "ctx.moveTo(" + a[1] + "," + a[2] + ");\n";
					break;
				case 1:
					str += "ctx.quadraticCurveTo(" + a[1] + "," + a[2] + "," + a[3] + "," + a[4] + ");\n";
					break;
				case 2:
					str += "ctx.lineTo(" + a[1] + "," + a[2] + ");\n";
					break;
			}
		}
		return new Function("ctx", str);
	};
	RenderCanvas2d.prototype.shapeToInterval = function (shapeCache, library) {
		// 0 fill
		// 1 stroke
		// 0 color
		// 1 gradient
		// 2 bitmap
		var result = [];
		for (let i = 0; i < shapeCache.length; i++) {
			result.push(this.shapeToCanvas(shapeCache[i], library));
		}
		return new RenderCanvas2dShapeInterval(this, result);
	};
	RenderCanvas2d.prototype.shapeToCanvas = function (shape, library) {
		var isStroke = shape.type == 1;
		var width = shape.width || 0;
		var fillInfo = shape.fill;
		if (!fillInfo) return;
		var cmdResult = this.buildCmd2dPath(shape.path2d);
		if (fillInfo.type == 0) {
			return {
				type: 0,
				cmd: cmdResult,
				color: fillInfo.color.slice(0),
				isStroke,
				width,
			};
		} else if (fillInfo.type == 1) {
			return {
				type: 1,
				cmd: cmdResult,
				isRadial: fillInfo.isRadial,
				focal: fillInfo.focal,
				matrix: fillInfo.matrix.slice(0),
				records: JSON.parse(JSON.stringify(fillInfo.records)),
				isStroke,
				width,
			};
		} else if (fillInfo.type == 2) {
			var id = fillInfo.id;
			var bitmapi = library.characterById(id).bitmapH();
			return {
				type: 2,
				cmd: cmdResult,
				matrix: fillInfo.matrix.slice(0),
				texture: bitmapi,
				isSmoothed: fillInfo.isSmoothed,
				isRepeating: fillInfo.isRepeating,
				isStroke,
				width,
			};
		}
	};
	RenderCanvas2d.prototype.registerShape = function (shapes, library) {
		return this.shapeToInterval(shapes, library);
	};
	RenderCanvas2d.prototype.pushMask = function () {
		if (this.maskState == 0) {
			this.ctx.beginPath();
			this.ctx.save();
			this.maskState = 1;
		}
	};
	RenderCanvas2d.prototype.activateMask = function () {
		this.ctx.clip();
		this.maskState = 0;
	};
	RenderCanvas2d.prototype.deactivateMask = function () {
		if (this.maskState == 0) {
			this.maskState = 2;
		}
	};
	RenderCanvas2d.prototype.popMask = function () {
		if (this.maskState == 2) {
			this.ctx.restore();
			this.maskState = 0;
		}
	};
	RenderCanvas2d.prototype.pushBlendMode = function (blendMode) {
		if (!sameBlendMode(this.blendModes[this.blendModes.length - 1], blendMode)) this.applyBlendMode(blendMode);
		this.blendModes.push(blendMode);
	};
	RenderCanvas2d.prototype.popBlendMode = function () {
		let old = this.blendModes.pop();
		let current = this.blendModes[this.blendModes.length - 1] || "normal";
		if (!sameBlendMode(old, current)) this.applyBlendMode(current);
	};
	RenderCanvas2d.prototype.renderBitmap = function (texture, matrix, colorTransform, isSmoothed) {
		var isA = this.isAllowImageColorTransform();
		this.setTransform(...matrix);
		this.setColorTransform(...colorTransform);
		this.ctx.imageSmoothingEnabled = isSmoothed || false;
		if (texture && texture.isDrawing) {
			this.ctx.setTransform(...this.matrixTransform);
			if (!isA || !checkImageColorTransform(colorTransform))
				this.ctx.globalAlpha = Math.max(0, Math.min(255 * colorTransform[3] + colorTransform[7], 255)) / 255;
			this.ctx.drawImage(texture.getTexture(isA ? colorTransform : null), 0, 0);
			this.ctx.globalAlpha = 1;
		}
	};
	RenderCanvas2d.prototype.renderShape = function (shapeInterval, matrix, colorTransform) {
		var isA = this.isAllowImageColorTransform();
		this.setTransform(...matrix);
		this.setColorTransform(...colorTransform);
		if (!shapeInterval) return;
		var shapeIntervalData = shapeInterval.shapeIntervalData;
		for (let i = 0; i < shapeIntervalData.length; i++) {
			const si = shapeIntervalData[i];
			if (!si) return;
			var isStroke = si.isStroke;
			var cmd = si.cmd;
			var width = si.width || 0;
			if (this.maskState == 1) {
				this.ctx.setTransform(...this.matrixTransform);
				cmd(this.ctx);
			} else if (this.maskState == 2) {
				// Canvas backend doesn't have to do anything to clear masks.
			} else {
				if (si.type == 0) {
					var color = si.color;
					this.ctx.setTransform(...this.matrixTransform);
					this.ctx.beginPath();
					cmd(this.ctx);
					var css = "rgba(" + generateColorTransform(color, this.colorTransform).join(",") + ")";
					if (isStroke) {
						this.ctx.lineWidth = width;
						this.ctx.lineCap = "round";
						this.ctx.lineJoin = "round";
						this.ctx.strokeStyle = css;
						this.ctx.stroke();
					} else {
						this.ctx.fillStyle = css;
						this.ctx.fill();
					}
				} else if (si.type == 1) {
					var isRadial = si.isRadial;
					this.ctx.setTransform(...this.matrixTransform);
					this.ctx.beginPath();
					cmd(this.ctx);
					var css;
					if (isRadial) {
						css = this.ctx.createRadialGradient(16384 * Math.min(Math.max(si.focal, -0.98), 0.98), 0, 0, 0, 0, 16384);
					} else {
						var xy = linearGradientXY(si.matrix);
						css = this.ctx.createLinearGradient(xy[0] || 0, xy[1] || 0, xy[2] || 0, xy[3] || 0);
					}
					for (let j = 0; j < si.records.length; j++) {
						const rc = si.records[j];
						css.addColorStop(rc[1], "rgba(" + generateColorTransform(rc[0], this.colorTransform).join(",") + ")");
					}
					if (isRadial) {
						this.ctx.save();
						this.ctx.transform(...si.matrix);
					}
					if (isStroke) {
						this.ctx.lineWidth = width;
						this.ctx.lineCap = "round";
						this.ctx.lineJoin = "round";
						this.ctx.strokeStyle = css;
						this.ctx.stroke();
					} else {
						this.ctx.fillStyle = css;
						this.ctx.fill();
					}
					if (isRadial) {
						this.ctx.restore();
					}
				} else if (si.type == 2) {
					var bMatrix = si.matrix;
					var repeat = si.isRepeating ? "repeat" : "no-repeat";
					var texture = si.texture;
					if (texture && texture.isDrawing) {
						this.ctx.setTransform(...this.matrixTransform);
						this.ctx.beginPath();
						cmd(this.ctx);
						this.ctx.save();
						this.ctx.transform(...bMatrix);
						this.ctx.imageSmoothingEnabled = si.isSmoothed || false;
						var image = texture.getTexture(isA ? colorTransform : null);
						if (!isA || !checkImageColorTransform(colorTransform))
							this.ctx.globalAlpha = Math.max(0, Math.min(255 * colorTransform[3] + colorTransform[7], 255)) / 255;
						var p = this.ctx.createPattern(image, repeat);
						this.ctx.fillStyle = p;
						this.ctx.fill();
						this.ctx.globalAlpha = 1;
						this.ctx.restore();
					}
				}
			}
		}
	};
	RenderCanvas2d.prototype.blend = function(commands, blendMode) {
		this.pushBlendMode(blendMode);
		commands.execute(this);
		this.popBlendMode();
	}

	const H263Decoder = function (deblocking) {
		this.state = new AT_H263_Decoder.H263State({
			sorensonSpark: true,
			useScalabilityMode: false,
		});
		this.deblocking = deblocking;
	};
	H263Decoder.prototype.preloadFrame = function (encodedFrame) {
		var reader = new AT_H263_Decoder.H263Reader(new Uint8Array(encodedFrame.data));
		let picture = this.state.parsePicture(reader, null);
		switch(picture.picture_type.getType()) {
			case "IFrame":
				return false;
			case "PFrame":
			case "DisposablePFrame":
				return true;
			default:
				throw new Error("Invalid picture type code: " + picture.picture_type.type);
		}
	};
	H263Decoder.prototype.decodeFrame = function (encodedFrame) {
		var reader = new AT_H263_Decoder.H263Reader(new Uint8Array(encodedFrame.data));
		this.state.decodeNextPicture(reader);
		var picture = this.state.getLastPicture();
		let [y, b, r] = picture.as_yuv();
		let [width, height] = picture.format.intoWidthAndHeight();
		var yuv = new Uint8Array(y.length + b.length + r.length);
		yuv.set(y, 0);
		yuv.set(b, y.length);
		yuv.set(r, y.length + b.length);
		return new Bitmap(width, height, "yuv420p", yuv);
	};

	const ByteReader = function(data) {
		this.data = new Uint8Array(data);
		this.offest = 0;
	}
	ByteReader.prototype.readByte = function() {
		if (this.offest >= this.data.length) 
			throw new Error("Unexpected end of file");
		return this.data[this.offest++];
	}
	ByteReader.prototype.readUint16be = function() {
		var byte1 = this.readByte();
		var byte2 = this.readByte();
		return (byte1 << 8) | byte2;
	}
	ByteReader.prototype.readBuf = function(length) {
		if ((this.offest + length) > this.data.length) 
			throw new Error("Unexpected end of file");
		var result = this.data.slice(this.offest, this.offest + length);
		this.offest += length;
		return result;
	}
	
	const ScreenVideoDecoder = function (size, version) {
		this.version = version;
		this.w = 0;
		this.h = 0;
		this.blockW = 0;
		this.blockH = 0;
		this.width = size[0];
		this.height = size[1];
		this.lastFrame = null;
	};
	ScreenVideoDecoder.prototype.preloadFrame = function (encodedFrame) {
		var byte_input = new ByteReader(encodedFrame.data);
		var type = byte_input.readByte() >> 4;
		switch (type) {
			case 1:
				return 0;
			case 2:
				return 1;
			default:
				throw new Error("Invalid frame type: " + type);
		}
	}
	ScreenVideoDecoder.prototype.fillBlock = function (a, b, x, y, cur_w, cur_h) {
		for (let _y = 0; _y < cur_h; _y++) {
			for (let _x = 0; _x < cur_w; _x++) {
				var rgbIdx = (_x + (cur_w * ((cur_h - _y) - 1))) * 3;
				var idx = ((_x + x) + (this.w * (_y + y))) * 4;
				a[idx] = b[rgbIdx + 2];
				a[idx + 1] = b[rgbIdx + 1];
				a[idx + 2] = b[rgbIdx];
				a[idx + 3] = 255;
			}
		}
	}
	ScreenVideoDecoder.prototype.decodeFrame = function (encodedFrame) {
		var byte_input = new ByteReader(encodedFrame.data);
		var isKeyframe = byte_input.readByte() >> 4 == 1;
		if (!isKeyframe && !this.lastFrame) 
			throw new Error("Missing reference frame");
		var hdr0 = byte_input.readUint16be();
		var blk_w = ((hdr0 >> 12) * 16) + 16;
		var w = hdr0 & 0xFFF;
		var hdr1 = byte_input.readUint16be();
		var blk_h = ((hdr1 >> 12) * 16) + 16;
		var h = hdr1 & 0xFFF;
		if (this.w != w || this.h != h || this.blockW != blk_w || this.blockH != blk_h) {
			this.w = w;
			this.h = h;
			this.blockW = blk_w;
			this.blockH = blk_h;
			this.lastFrame = new Uint8Array(w * h * 4);
		}
		var rgba = this.lastFrame;
		var is_intra = true;
		for (let yc = 0; yc < this.h; yc += this.blockH) {
			let cur_h = Math.min((this.h - yc), this.blockH);
			for (let xc = 0; xc < this.w; xc += this.blockW) {
				let cur_w = Math.min((this.w - xc), this.blockW);
				var dataSize = byte_input.readUint16be();
				if (dataSize > 0) this.fillBlock(rgba, new Uint8Array(ZLib.decompress(byte_input.readBuf(dataSize).buffer, (cur_w * cur_h) * 3)), xc, (this.h - yc) - cur_h, cur_w, cur_h);
				else is_intra = false;
			}
		}
		if (is_intra != isKeyframe) 
			throw new Error("Not all blocks were updated by a supposed keyframe");
		return new Bitmap(w, h, "rgba", rgba);
	};

	function crop(data, width, to_width, to_height) {
		let height = (data.length / width) | 0;
		if (width > to_width) {
			let new_width = to_width;
			let new_height = Math.min(height, to_height);
			let _data = new Uint8Array(new_width * new_height);
			for (let row = 0; row < new_height; row++) {
				_data.set(data.subarray(row * width, (row * width + new_width)), row * new_width);
			}
			return _data;
		} else {
			return data.subarray(0, width * Math.min(height, to_height));
		}
	}

	const VP6Decoder = function (size, withAlpha) {
		this.width = size[0];
		this.height = size[1];
		this.withAlpha = withAlpha;
		this.decoder = new AT_NIHAV_VP6_Decoder.VP56Decoder(6, withAlpha, true);
		this.support = new AT_NIHAV_VP6_Decoder.NADecoderSupport();
		this.bitreader = new AT_NIHAV_VP6_Decoder.VP6BR();
		this.initCalled = false;
		this.lastFrame = null; // NABufferRef NAVideoBuffer
	};
	VP6Decoder.prototype.preloadFrame = function (encodedFrame) {
		return new Uint8Array(encodedFrame.data)[0] & 128;
	};
	VP6Decoder.prototype.decodeFrame = function (encodedFrame) {
		var videoData = new Uint8Array(encodedFrame.data);
		if (!this.initCalled) {
			var bool_coder = new AT_NIHAV_VP6_Decoder.BoolCoder(videoData.subarray(this.withAlpha ? 3 : 0));
			let header = this.bitreader.parseHeader(bool_coder);
			let video_info = new AT_NIHAV_VP6_Decoder.NAVideoInfo(header.disp_w * 16, header.disp_h * 16, true, this.withAlpha ? AT_NIHAV_VP6_Decoder.VP_YUVA420_FORMAT : AT_NIHAV_VP6_Decoder.YUV420_FORMAT);
			this.decoder.init(this.support, video_info);
			this.initCalled = true;
		}
		let decoded;
		var frame = null;
		decoded = this.decoder.decode_frame(this.support, videoData, this.bitreader);
		frame = decoded[0].value;
		let yuv = frame.get_data();
		let [width, height] = frame.get_dimensions(0);
		let [chroma_width, chroma_height] = frame.get_dimensions(1);
		let offsets = [
			frame.get_offset(0),
			frame.get_offset(1),
			frame.get_offset(2)
		];
		if ((width < this.width) || (height < this.height)) {
			console.log("A VP6 video frame is smaller than the bounds of the stream it belongs in. This is not supported.");
		}
		let y = yuv.subarray(offsets[0], offsets[0] + width * height);
		let u = yuv.subarray(offsets[1], offsets[1] + chroma_width * chroma_height);
		let v = yuv.subarray(offsets[2], offsets[2] + chroma_width * chroma_height);
		let _y = crop(y, width, this.width, this.height);
		let _u = crop(u, chroma_width, ((this.width + 1) / 2) | 0, ((this.height + 1) / 2) | 0);
		let _v = crop(v, chroma_width, ((this.width + 1) / 2) | 0, ((this.height + 1) / 2) | 0);
		width = this.width;
		height = this.height;
		if (this.withAlpha) {
			let [alpha_width, alpha_height] = frame.get_dimensions(3);
			let alpha_offset = frame.get_offset(3);
			let alpha = yuv.subarray(alpha_offset, alpha_offset + alpha_width * alpha_height);
			let a = crop(alpha, alpha_width, this.width, this.height);
			let yuvData = new Uint8Array(_y.length + _u.length + _v.length + a.length);
			yuvData.set(_y, 0);
			yuvData.set(_u, _y.length);
			yuvData.set(_v, _y.length + _u.length);
			yuvData.set(a, _y.length + _u.length + _v.length);
			return new Bitmap(width, height, "yuva420p", yuvData);
		} else {
			let yuvData = new Uint8Array(_y.length + _u.length + _v.length);
			yuvData.set(_y, 0);
			yuvData.set(_u, _y.length);
			yuvData.set(_v, _y.length + _u.length);
			return new Bitmap(width, height, "yuv420p", yuvData);
		}
	};

	const VideoStream = function(decoder) {
		this.bitmap = null;
		this.decoder = decoder;
	}
	const VideoBackend = function() {
		this.streams = new Set();
	}
	VideoBackend.prototype.registerVideoStream = function(_num_frames, size, codec, filter) {
		var decoder;
		switch (codec) {
			case "none":
				decoder = null;
				break;
			case "H263":
				decoder = new H263Decoder(filter);
				break;
			case "ScreenVideo":
				decoder = new ScreenVideoDecoder(size, false);
				break;
			case "Vp6":
				decoder = new VP6Decoder(size, false);
				break;
			case "Vp6WithAlpha":
				decoder = new VP6Decoder(size, true);
				break;
			default:
				console.log("Unsupported video codec type " + codec);
		}
		var stream = new VideoStream(decoder);
		this.streams.add(stream);
		return stream;
	}
	VideoBackend.prototype.preloadVideoStreamFrame = function(stream, encodedFrame) {
		return stream.decoder.preloadFrame(encodedFrame);
	}
	VideoBackend.prototype.decodeVideoStreamFrame = function(stream, encodedFrame, renderer) {
		var _stream = stream;
		var decoder = _stream.decoder;
		var result = null;
		try {
			result = decoder.decodeFrame(encodedFrame); 
		} catch(e) {
			console.log("Got error when seeking to video frame", e);
		}
		var canvas = document.createElement("canvas");
		if (result) {
			result.toRGBA();
			if (result.width && result.height) {
				canvas.width = result.width;
				canvas.height = result.height;
				var data = result.data;
				var ctx = canvas.getContext("2d");
				var rImageData = ctx.createImageData(canvas.width, canvas.height);
				var rData = rImageData.data;
				rData.set(data, 0);
				ctx.putImageData(rImageData, 0, 0);   
			} else {
				result = null;
			}
		}
		let handle;
		if (result || !stream.bitmap) {
			if (stream.bitmap) {
				handle = stream.bitmap;
				handle.setImage(canvas);
			} else {
				handle = renderer.createImageInterval();
				handle.setImage(canvas);
			}    
		} else {
			handle = stream.bitmap;
		}
		stream.bitmap = handle;
		return handle;
	}
	const MovieLibrary = function () {
		this.characters = new Map();
		this.exportCharacters = new Map();
		this.jpegTables = null;
	};
	MovieLibrary.prototype.characterById = function (id) {
		return this.characters.get(id);
	};
	MovieLibrary.prototype.registerCharacter = function (id, character) {
		if (!this.containsCharacter(id)) {
			this.characters.set(id, character);
		} else {
			console.log("Character ID collision: Tried to register ID twice: " + id);
		}
	};
	MovieLibrary.prototype.registerExport = function (id, exportName) {
		this.exportCharacters.set(exportName, id);
	};
	MovieLibrary.prototype.containsCharacter = function (id) {
		return this.characters.has(id);
	};
	MovieLibrary.prototype.instantiateById = function (id) {
		var c = this.characterById(id);
		if (c) {
			return this.instantiateDisplayObject(c);
		} else {
			console.log("Character id doesn't exist");
		}
	};
	MovieLibrary.prototype.instantiateDisplayObject = function (character) {
		switch (character.displayType) {
			case "Shape":
			case "MorphShape":
			case "StaticText":
			case "TextField":
			case "MovieClip":
			case "Buttom":
			case "Video":
			case "Bitmap":
				return character.instantiate();
			default:
				console.log("Not a DisplayObject", character);
		}
	};
	MovieLibrary.prototype.setJpegTables = function (jt) {
		if (this.jpegTables) {
			console.log("SWF contains multiple JPEGTables tags");
			return;
		}
		if (jt.byteLength) this.jpegTables = jt;
	};
	const Library = function () {
		this.movieLibraries = new Map();
		this.deviceFont = null;
		this.avm2ClassRegistry = null;
	};
	Library.prototype.libraryForMovie = function (movie) {
		return this.movieLibraries.get(movie);
	};
	Library.prototype.libraryForMovieMut = function (movie) {
		if (this.movieLibraries.has(movie)) {
			return this.movieLibraries.get(movie);
		} else {
			var newMovie = new MovieLibrary();
			this.movieLibraries.set(movie, newMovie);
			return newMovie;
		}
	};

	const UpdateContext = function (data) {
		for (var p in data) {
			this[p] = data[p];
		}
	};
	UpdateContext.prototype.addInstanceCounter = function () {
		return this.player.addInstanceCounter();
	};
	const RenderContext = function (data) {
		for (var p in data) {
			this[p] = data[p];
		}
	};

	const ExecutionLimit = function (limit) {
		this.limit = limit;
	};
	ExecutionLimit.prototype.didOpsBreachLimit = function (context, g) {
		this.limit -= g;
		return this.limit < 0;
	};
	ExecutionLimit.prototype.terminate = function () {
		this.limit = -1;
	};

	const Stage = function(fullscreen) {
		DisplayObjectContainer.call(this);
		this._backgroundColor = null;
		this.child = new ChildContainer();
		this.movie_size = [0, 0];
		this.stage_size = [0, 0];
		this.viewport_matrix = [1, 0, 0, 1, 0, 0];
		this._movie = null;
	}
	Stage.prototype = Object.create(DisplayObjectContainer.prototype);
	Stage.prototype.constructor = Stage;
	Stage.prototype.rawContainer = function () {
		return this.child;
	};
	Stage.prototype.getBackgroundColor = function() {
		return this._backgroundColor;
	}
	Stage.prototype.setBackgroundColor = function(color) {
		this._backgroundColor = color.slice(0);
	}
	Stage.prototype.movie = function() {
		return this._movie;
	}
	Stage.prototype.setMovie = function(movie) {
		this._movie = movie;
	}
	Stage.prototype.getRootClip = function() {
		return this.childByDepth(0);
	}
	Stage.prototype.render = function(context) {
		context.transformStack.stackPush(this.viewport_matrix, [1, 1, 1, 1, 0, 0, 0, 0]);
		renderBase.call(this, context);
        context.transformStack.stackPop();
	}

	const Player = function () {
		this.stage = null;
		this.version = 0;
		this.swf = null;
		this.isPlaying = true;
		this.needsRender = false;
		this.renderer = null;
		this.audio = null;
		this.frameRate = 30;
		this.frameAccumulator = 0;
		this.instanceCounter = 0;
		this.library = null;
		this.avm1 = null;
		this.loaded = false;
		this.callback = null;
	};
	Object.defineProperties(Player.prototype, {
		width: {
			get: function () {
				var movie = this.swf;
				return movie ? movie.width : 0;
			},
		},
		height: {
			get: function () {
				var movie = this.swf;
				return movie ? movie.height : 0;
			},
		},
	});
	Player.prototype.build = function () {
		this.library = new Library();
		this.renderer = new RenderCanvas2d();
		this.canvas = this.renderer.canvas;
		this.avm1 = new Avm1();
		this.audio = new AudioBackend();
		this.video = new VideoBackend();
		this.stage = new Stage("normal");
	};
	Player.prototype.setPlaying = function (v) {
		if (v) this.audio.play();
		else this.audio.pause();
		this.isPlaying = v;
	};
	Player.prototype.getVolume = function () {
		return this.audio.getVolume();
	};
	Player.prototype.setVolume = function (volume) {
		this.audio.setVolume(volume);
	};
	Player.prototype.resize = function (w, h) {
		this.needsRender = true;
		var scaleW = w / this.width;
		var scaleH = h / this.height;
		var scale = Math.min(Math.abs(scaleW), Math.abs(scaleH));
		var qScale = 1;
		if (this.getQuality() == "low") {
			qScale = 0.5;
		} else if (this.getQuality() == "medium") {
			qScale = 0.8;
		}
		if (this.getQuality() == "high") {
			qScale *= window.devicePixelRatio || 1;
		}
		var _w = Math.floor(this.width * scale);
		var _h = Math.floor(this.height * scale);
		this.renderer.resize(_w * qScale, _h * qScale);
		this.render();
	};
	Player.prototype.getRootClip = function () {
		return this.stage.getRootClip();
	};
	Player.prototype.togglePlayRootMovie = function (context) {
		var root = this.getRootClip();
		if (root.isPlaying()) {
			root.stop(context);
		} else {
			root.play(context);
		}
	};
	Player.prototype.rewindRootMovie = function (context) {
		var root = this.getRootClip();
		root.gotoFrame(context, 1, true);
	};
	Player.prototype.forwardRootMovie = function (context) {
		var root = this.getRootClip();
		root.nextFrame(context);
	};
	Player.prototype.backRootMovie = function (context) {
		var root = this.getRootClip();
		root.prevFrame(context);
	};
	Player.prototype.getQuality = function () {
		return this.renderer.quality;
	};
	Player.prototype.setQuality = function (quality) {
		this.renderer.setQuality(quality);
	};
	Player.prototype.loadSwfData = function (data) {
		var movie = SwfMovie.fromData(data);
		this.setRootMovie(movie);
	};
	Player.prototype.preload = function (executionLimit) {
		return this.mutateWithUpdateContext((context) => {
			var did_finish = true;
			var root = this.getRootClip();
			did_finish = root.preload(context, executionLimit);
			return did_finish;
		});
	};
	Player.prototype.getProgress = function () {
		var root = this.getRootClip();
		return [root.getLoadedBytes(), root.getTotalBytes()];
	};
	Player.prototype.tick = function (dt) {
		var isF = this.preload(new ExecutionLimit(50000));
		if (this.isPlaying && isF) {
			this.frameAccumulator += dt;
			var frameTime = +(1000 / this.frameRate).toFixed(1);
			while (this.frameAccumulator >= frameTime) {
				this.frameAccumulator -= frameTime;
				this.runFrame();
			}
			this.audio.tick();
		}
	};
	Player.prototype.render = function () {
		if (!this.needsRender) return;
		this.needsRender = false;
		var backgroundColor = [255, 255, 255, 1];
		var ts = new TransformStack();
		var scaleW = this.renderer.width / this.width;
		var scaleH = this.renderer.height / this.height;
		var scale = Math.min(Math.abs(scaleW), Math.abs(scaleH));
		ts.stackPush([scale / 20, 0, 0, scale / 20, 0, 0], [1, 1, 1, 1, 0, 0, 0, 0]);
		var context = new RenderContext({
			library: this.library,
			renderer: this.renderer,
			commands: new CommandList(),
			transformStack: ts,
		});
		backgroundColor = this.stage.getBackgroundColor();
		if (!backgroundColor) backgroundColor = [255, 255, 255, 1];
		this.stage.render(context);
		ts.stackPop();
		this.renderer.submitFrame(backgroundColor, context.commands);
	};
	Player.prototype.runFrame = function () {
		this.needsRender = true;
		this.mutateWithUpdateContext((context) => {
			this.avm1.runFrame(context);
		});
	};
	Player.prototype.setRootMovie = function (movie) {
		this.swf = movie;
		this.frameRate = movie.frameRate;
		this.audio.setFrameRate(movie.frameRate);
		this.instanceCounter = 0;
		this.mutateWithUpdateContext((context) => {
			this.stage.movie_size[0] = context.swf.width;
			this.stage.movie_size[1] = context.swf.height;
			this.stage.setMovie(context.swf);
			var root = MovieClip.playerRootMovie(movie);
            root.setDepth(0);
			root.postInstantiation(context, null, "movie", false);
			root.setDefaultInstanceName(context);
            context.stage.replaceAtDepth(context, 0, root);
		});
		if (this.callback) this.callback();
	};
	Player.prototype.mutateWithUpdateContext = function (callback) {
		var context = new UpdateContext({
			player: this,
			stage: this.stage,
			renderer: this.renderer,
			library: this.library,
			audio: this.audio,
			video: this.video,
			swf: this.swf,
			avm1: this.avm1,
		});
		let ret = callback(context);
		return ret;
	};
	Player.prototype.addInstanceCounter = function () {
		return this.instanceCounter++;
	};
	Player.prototype.destroy = function () {
		if (this.audio) this.audio.cleanup();
		this.renderer.destroy();
	};

	const _getDuraction = function (num) {
		var txt = "";
		var _ms = Math.floor(num);
		var _mm = Math.floor(num / 60);
		var ms = _ms % 60;
		var mm = _mm % 60;
		var mh = Math.floor(num / 3600);
		if (_mm >= 60) txt += "" + mh, txt += ":";
		if (mm >= 10 || _ms < 600) txt += "" + mm;
		else txt += "0" + mm;
		txt += ":";
		if (ms >= 10) txt += "" + ms;
		else txt += "0" + ms;
		return txt;
	}
	const _getByteText = function (byte) {
		if (byte >= 1000000) {
			return "" + Math.floor(byte / 10000) / 100 + "MB";
		} else {
			if (byte >= 1000) {
				return "" + Math.floor(byte / 1000) + "KB";
			} else {
				return "" + byte + "B";
			}
		}
	}
	const Slot = function () {
		this._listeners = [];
	}
	Slot.prototype.subscribe = function (fn) {
		this._listeners.push(fn);
	}
	Slot.prototype.emit = function () {
		for (const listener of this._listeners) listener(...arguments);
	}
	const ScreenCap = function () {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
	}
	ScreenCap.prototype.scan = function (image, width, height) {
		this.canvas.width = width || image.width;
		this.canvas.height = height || image.height;
		this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
		return this.canvas.toDataURL();
	}
	const PinkFiePlayer = function (options = {}) {
		this.onload = new Slot();
		this.onstartload = new Slot();
		this.oncleanup = new Slot();
		this.onerror = new Slot();
		this.onprogress = new Slot();
		this.onresume = new Slot();
		this.onpause = new Slot();
		this.onoptionschange = new Slot();
		this.MAGIC = {
			LARGE_Z_INDEX: "9999999999",
		};
		this.scanned = new ScreenCap();
		this.fullscreenEnabled = false;
		this.clickToPlayContainer = null;
		this.root = document.createElement("div");
		this.root.className = "pinkfie-player-root";
		this.playerContainer = document.createElement("div");
		this.playerContainer.className = "pinkfie-player-stage";
		this.root.appendChild(this.playerContainer);
		this.width = 0;
		this.height = 0;
		this._width = 0;
		this._height = 0;
		this.swfData = null;
		this.options = {};
		this._viewFrame = false;
		this.debugCanvas = document.createElement("canvas");
		this.debugCtx = this.debugCanvas.getContext("2d");
		this.debugCanvas.style.position = "absolute";
		this.debugCanvas.style.top = "0";
		this.debugCanvas.style.left = "0";
		this.debugCanvas.style.display = "none";
		this.playerContainer.appendChild(this.debugCanvas);
		this.resize(640, 400);
		this.initContextMenu();
		this.addStatsControls();
		this.addMessageVerticals();
		this.addSettingVerticals();
		this.startTime = Date.now();
		this.startTime2 = Date.now();
		this.isError = false;
		this.messageStatus = ["", 0, 1000, false];
		this._displayMessage = [0, "", 0, 1000];
		this.setOptions(Object.assign(Object.assign({}, options), PinkFiePlayer.DEFAULT_OPTIONS));
		window.addEventListener("resize", this.updateFullscreen.bind(this));
		document.addEventListener("fullscreenchange", this.onfullscreenchange.bind(this));
		document.addEventListener("mozfullscreenchange", this.onfullscreenchange.bind(this));
		document.addEventListener("webkitfullscreenchange", this.onfullscreenchange.bind(this));
		this.flash = null;
		setInterval(this.tick.bind(this), 10);
	};
	PinkFiePlayer.prototype.initContextMenu = function () {
		this.MenuVertical = document.createElement("div");
		this.MenuVertical.className = "watcher-pinkfie-menu-vertical";
		this.movie_playPause = this._createE("Pause", function () {
			this.toggleRunning();
			this.MenuVertical.style.display = "none";
		});
		this.MenuVertical.appendChild(this.movie_playPause);
		this.movie_playStop = this._createE("Stop", function () {
			this.c_playStop();
			this.MenuVertical.style.display = "none";
		});
		this.MenuVertical.appendChild(this.movie_playStop);
		this.MenuVertical.appendChild(this._createE("Rewind", function () {
			this.c_rewind();
			this.MenuVertical.style.display = "none";
		}));
		this.MenuVertical.appendChild(this._createE("Step Forward", function () {
			this.c_Forward();
			this.MenuVertical.style.display = "none";
		}));
		this.MenuVertical.appendChild(this._createE("Step Back", function () {
			this.c_Back();
			this.MenuVertical.style.display = "none";
		}));
		this.MenuVertical.appendChild(this._createE("View Stats", () => {
			this.viewStats();
			this.MenuVertical.style.display = "none";
		}));
		this.MenuVertical.appendChild(this._createE("Save Screenshot", function () {
			this.saveScreenshot();
			this.MenuVertical.style.display = "none";
		}));
		this.movie_swfDownload = this._createE("Download SWF", function () {
			this.downloadSwf();
			this.MenuVertical.style.display = "none";
		});
		this.MenuVertical.appendChild(this.movie_swfDownload);
		this.MenuVertical.appendChild(this._createE("Full Screen", function () {
			if (this.fullscreenEnabled) {
				this._displayMessage[1] = "Full Screen: Off";
				this._displayMessage[0] = 2;
				this._displayMessage[2] = Date.now();
				this.exitFullscreen();
			} else {
				this._displayMessage[1] = "Full Screen: On";
				this._displayMessage[0] = 2;
				this._displayMessage[2] = Date.now();
				this.enterFullscreen();
			}
			this.MenuVertical.style.display = "none";
		}));
		this.MenuVertical.appendChild(this._createE("Settings", function () {
			this.showSetting();
			this.MenuVertical.style.display = "none";
		}));
		this.MenuVertical.style.display = "none";
		this.playerContainer.appendChild(this.MenuVertical);
		document.addEventListener("contextmenu", (e) => {
			if (this.flash) {
				if (e.target === this.flash.canvas || e.target === this.debugCanvas || e.target === this.clickToPlayContainer) {
					e.preventDefault();
					this.sendList(e);
				}
			}
		});
		document.addEventListener("click", (e) => {
			this.MenuVertical.style.display = "none";
		});
	};
	PinkFiePlayer.prototype.addSettingVerticals = function () {
		this.settingVertical = document.createElement("div");
		this.settingVertical.className = "watcher-pinkfie-setting";
		this.settingVertical.style = "";
		this.settingVertical.style.display = "none";

		var rrj = document.createElement("div");
		rrj.style = "backdrop-filter: blur(2px);";
		rrj.style.overflow = "hidden";
		rrj.style.position = "relative";
		rrj.style.top = "0";
		rrj.style.left = "50%";
		rrj.style.padding = "6px";
		rrj.style.transform = "translate(-50%, 0)";
		rrj.style.background = "rgba(0, 0, 0, 0.6)";
		rrj.style.width = "320px";
		rrj.style.height = "auto";
		rrj.innerHTML = '<h3 style="margin:0;">Settings</h3>';

		var rrj2 = document.createElement("a");
		rrj2.onclick = () => {
			this.settingVertical.style.display = "none";
		};
		rrj2.style = "";
		rrj2.style.position = "fixed";
		rrj2.style.display = "block";
		rrj2.style.top = "2px";
		rrj2.style.right = "2px";
		rrj2.style["background-position"] = "50% 80%";
		rrj2.innerHTML = "[x]";

		var rrj3 = document.createElement("label");
		rrj3.innerHTML = "volume:";
		var rrj4 = document.createElement("input");
		rrj4.style.width = "70px";
		rrj4.type = "range";
		rrj4.value = 100;
		rrj4.max = 100;
		rrj4.min = 0;
		rrj4.addEventListener("input", () => {
			this.setOptions({
				volume: rrj4.value,
			});
		});
		this._rrj4 = rrj4;

		var rrj7 = document.createElement("label");
		rrj7.innerHTML = "Quality: ";

		var rrj8 = document.createElement("select");
		rrj8.innerHTML =
			'<option value="high">high<option value="medium">medium<option value="low">low';
		rrj8.addEventListener("change", () => {
			if (rrj8.value) {
				this.setOptions({
					quality: rrj8.value,
				});
			}
		});

		this.__rrj8 = rrj8;

		var fdfj = document.createElement("input");
		fdfj.type = "range";
		fdfj.value = 1;
		fdfj.min = 1;
		fdfj.max = 2;

		fdfj.addEventListener("input", () => {
			if (fdfj.value && this.flash) {
				var clip = this.flash.getRootClip();
				if (clip) this.c_gotoFrame(+fdfj.value, !clip.isPlaying());
			}
		});

		this.__fdfj = fdfj;

		rrj.appendChild(rrj2);
		rrj.appendChild(rrj3);
		rrj.appendChild(rrj4);
		rrj.appendChild(rrj7);
		rrj.appendChild(rrj8);

		rrj.appendChild(document.createElement("br"));

		var a = document.createElement("label");
		a.innerHTML = "Jump Frame";

		var a2 = document.createElement("label");
		a2.innerHTML = "1/1";

		this.__a2 = a2;

		rrj.appendChild(a);
		rrj.appendChild(fdfj);
		rrj.appendChild(a2);

		var rrj5 = document.createElement("label");
		rrj5.innerHTML = "Render Mode: ";

		var rrj6 = document.createElement("select");
		rrj6.innerHTML = '<option value="0">render<option value="1">render with display bounds<option value="2">display bounds without render';
		rrj6.addEventListener("change", () => {
			if (rrj6.value) {
				this.setOptions({
					rendermode: +rrj6.value,
				});
			}
		});

		rrj.appendChild(document.createElement("br"));
		rrj.appendChild(rrj5);
		rrj.appendChild(rrj6);

		this.settingVertical.appendChild(rrj);

		this.playerContainer.appendChild(this.settingVertical);
	};
	PinkFiePlayer.prototype.addMessageVerticals = function () {
		this.messageE = document.createElement("div");
		this.messageE.style.color = "#fff";
		this.messageE.style.position = "absolute";
		this.messageE.style.background = "rgba(0,0,0,0.75)";
		this.messageE.style.backdropFilter = "blur(2px)";
		this.messageE.style.top = "0px";
		this.messageE.style.left = "0px";
		this.messageE.style.width = "100%";
		this.messageE.style.height = "auto";
		this.messageE.style.display = "none";

		var content = document.createElement("p");
		content.textContent = "Testing";

		content.style.margin = "2px";
		content.style.textAlign = "center";

		this.messageContentE = content;

		this.messageE.appendChild(content);

		this.playerContainer.appendChild(this.messageE);
	};
	PinkFiePlayer.prototype.addStatsControls = function () {
		this.statsE = document.createElement("div");
		this.statsE.style.color = "#fff";
		this.statsE.style.position = "absolute";
		this.statsE.style.top = "0px";
		this.statsE.style.left = "0px";
		this.statsE.style.fontSize = "15px";
		this.statsE.style.display = "none";

		var r = document.createElement("div");
		r.style.background = "rgba(0,0,0,0.75)";
		r.style.backdropFilter = "blur(2px)";
		r.style.padding = "3px 5px";
		r.style.margin = "3px";
		r.style.height = "auto";
		r.style.display = "none";
		r.style.fontSize = "12px";

		var playpause = document.createElement("div");
		playpause.textContent = "Pause";
		playpause.style.background = "rgba(0,0,0,0.75)";
		playpause.style.backdropFilter = "blur(2px)";
		playpause.style.padding = "3px 5px";
		playpause.style.margin = "3px";
		playpause.style.width = "auto";
		playpause.style.height = "auto";
		playpause.style.display = "none";
		playpause.style.fontSize = "12px";

		this.statsE_R = r;
		this.statsE_PP = playpause;

		this.statsE.appendChild(playpause);
		this.statsE.appendChild(r);

		this.playerContainer.appendChild(this.statsE);
	};
	PinkFiePlayer.prototype._createE = function (name, fun) {
		var MVG1 = document.createElement("div");
		MVG1.textContent = name;
		MVG1.onclick = fun.bind(this);
		return MVG1;
	};
	PinkFiePlayer.prototype.sendList = function (event) {
		var rect = this.playerContainer.getBoundingClientRect();
		this.MenuVertical.style = "";
		this.MenuVertical.style.position = "absolute";
		this.MenuVertical.style.top = event.clientY - rect.top + "px";
		this.MenuVertical.style.left = event.clientX - rect.left + "px";
		this.MenuVertical.style.height = "auto";
		if (this.swfData) {
			this.movie_swfDownload.style.display = "";
		} else {
			this.movie_swfDownload.style.display = "none";
		}
		if (this.hasFlash() && this.flash.isPlaying) {
			this.movie_playPause.innerHTML = "Pause";
		} else {
			this.movie_playPause.innerHTML = "Resume";
		}
	};
	PinkFiePlayer.prototype.attach = function (child) {
		child.appendChild(this.root);
	};
	PinkFiePlayer.prototype.hasFlash = function () {
		return !!this.flash;
	};
	PinkFiePlayer.prototype.enableAttribute = function (name) {
		this.root.setAttribute(name, "");
	};
	PinkFiePlayer.prototype.disableAttribute = function (name) {
		this.root.removeAttribute(name);
	};
	PinkFiePlayer.prototype.setAttribute = function (name, enabled) {
		if (enabled) {
			this.enableAttribute(name);
		} else {
			this.disableAttribute(name);
		}
	};
	PinkFiePlayer.prototype.updateFullscreen = function () {
		if (!this.fullscreenEnabled) {
			this.applyResizeFlashPlayer();
			return;
		}
		this._resize(window.innerWidth, window.innerHeight);
		this.root.style.paddingLeft = "0px";
		this.root.style.paddingTop = "0px";
	};
	PinkFiePlayer.prototype.onfullscreenchange = function () {
		if (
			typeof document.fullscreen === "boolean" &&
			document.fullscreen !== this.fullscreenEnabled
		) {
			this.exitFullscreen();
		} else if (
			typeof document.webkitIsFullScreen === "boolean" &&
			document.webkitIsFullScreen !== this.fullscreenEnabled
		) {
			this.exitFullscreen();
		}
	};
	PinkFiePlayer.prototype.enterFullscreen = function () {
		if (true) {
			if (this.root.requestFullScreenWithKeys) {
				this.root.requestFullScreenWithKeys();
			} else if (this.root.webkitRequestFullScreen) {
				this.root.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			} else if (this.root.requestFullscreen) {
				this.root.requestFullscreen();
			}
		}
		document.body.classList.add("pinkfie-body-fullscreen");
		this.root.style.zIndex = this.MAGIC.LARGE_Z_INDEX;
		this.enableAttribute("fullscreen");
		this.fullscreenEnabled = true;
		this.updateFullscreen();
	};
	PinkFiePlayer.prototype.exitFullscreen = function () {
		this.disableAttribute("fullscreen");
		this.fullscreenEnabled = false;
		if (
			document.fullscreenElement === this.root ||
			document.webkitFullscreenElement === this.root
		) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
		this.root.style.zIndex = "";
		document.body.classList.remove("pinkfie-body-fullscreen");
		this._resize(this.width, this.height);
	};
	PinkFiePlayer.prototype.c_bbbb = function () {
		this.setOptions({
			viewBounds: !this.options.viewBounds,
		});
	};
	PinkFiePlayer.prototype.getOptions = function () {
		return this.options;
	};
	PinkFiePlayer.prototype.setOptions = function (changedOptions) {
		this.options = Object.assign(
			Object.assign({}, this.options),
			changedOptions
		);
		this._rrj4.value = this.options.volume;
		if (this.__rrj8) {
			this.__rrj8.value = this.options.quality;
		}
		if (this.hasFlash()) {
			this.applyOptionsToFlash();
		}
		this.onoptionschange.emit(changedOptions);
	};
	PinkFiePlayer.prototype.getRectStage = function () {
		var _movieCanvas = this.flash.canvas;
		var w = 0,
			h = 0,
			x = 0,
			y = 0;
		var __Width = this._width;
		var __Height = this._height;
		if (__Height - _movieCanvas.height * (__Width / _movieCanvas.width) < 0) {
			w = _movieCanvas.width * (__Height / _movieCanvas.height);
			h = _movieCanvas.height * (__Height / _movieCanvas.height);
			x = (__Width - w) / 2;
		} else {
			w = _movieCanvas.width * (__Width / _movieCanvas.width);
			h = _movieCanvas.height * (__Width / _movieCanvas.width);
			y = (__Height - h) / 2;
		}
		return [x, y, w, h];
	};
	PinkFiePlayer.prototype.renderBounds = function (fds) {
		var debctx = this.debugCtx;
		var debcanv = this.debugCanvas;
		var clip = this.flash.getRootClip();
		if (!clip) return;
		debctx.clearRect(0, 0, debcanv.width, debcanv.height);
		if (fds) {
			debctx.fillStyle = "#fff";
			debctx.fillRect(0, 0, debcanv.width, debcanv.height);
		}
		var rTags = [];
		clip.debugRenderBounds(
			[
				debcanv.width / this.flash.width / 20,
				0,
				0,
				debcanv.height / this.flash.height / 20,
				0,
				0,
			],
			[1, 1, 1, 1, 0, 0, 0, 0],
			rTags
		);
		var oCT = [1, 1, 1, 1, 0, 0, 0, 0];
		var oColor = [0, 0, 0, 1];
		var oTitle = "";
		for (let i = 0; i < rTags.length; i++) {
			const tag = rTags[i];
			var tid = tag[0];
			switch (tid) {
				case 0:
					debctx.setTransform(1, 0, 0, 1, 0, 0);
					debctx.strokeStyle = "rgba(" + generateColorTransform(oColor, oCT).join(",") + ")";
					debctx.lineWidth = 2;
					debctx.beginPath();
					debctx.moveTo(tag[1], tag[2]);
					debctx.lineTo(tag[3], tag[4]);
					debctx.lineTo(tag[5], tag[6]);
					debctx.lineTo(tag[7], tag[8]);
					debctx.lineTo(tag[1], tag[2]);
					debctx.stroke();
					break;
				case 1:
					debctx.setTransform(1, 0, 0, 1, 0, 0);
					debctx.strokeStyle = "rgba(" + generateColorTransform([0, 0, 0, 1], oCT).join(",") + ")";
					debctx.lineWidth = 2;
					debctx.beginPath();
					debctx.rect(tag[1], tag[2], tag[3] - tag[1], tag[4] - tag[2]);
					debctx.stroke();
					break;
				case 2:
					debctx.setTransform(1, 0, 0, 1, 0, 0);
					debctx.fillStyle = "rgba(" + generateColorTransform(oColor, oCT).join(",") + ")";
					debctx.textAlign = "left";
					debctx.font = "20px sans-serif";
					debctx.fillText(oTitle, tag[1], tag[2] - 7);
					break;
				case 3:
					oCT = tag[1];
					break;
				case 4:
					oTitle = tag[1];
					oColor[0] = tag[2];
					oColor[1] = tag[3];
					oColor[2] = tag[4];
					break;
			}
		}
	};
	PinkFiePlayer.prototype.handleError = function (e) {
		console.log(e);
		this.isError = true;
	}
	PinkFiePlayer.prototype.tick = function () {
		if (this.flash) {
			if (!this.isError) {
				try {
					var c = 3;
					var d = true;
					while ((c > 0) && ((Date.now() - this.startTime) >= 10) && d) {
						this.flash.tick(10);
						this.startTime += 10;
						c--;
						d = ((Date.now() - this.startTime2) <= 80);
					}
					if (!d) {
						this.startTime = Date.now();
					}
					this.startTime2 = Date.now();
				} catch(e) {
					this.handleError(e);
				}	
			}
			var rend = this.options.rendermode;
			if (rend == 1 || rend == 2) {
				this.debugCanvas.style.display = "";
				this.renderBounds(rend == 2);
			} else {
				this.debugCanvas.style.display = "none";
			}
			if (rend == 0 || rend == 1) this.flash.render();

			var gloaded = this.flash.getProgress();
			if (gloaded[0] == gloaded[1]) {
				this.messageStatus[1] = 0;
				this.messageStatus[3] = true;
			} else {
				this.messageStatus[0] = "\u23F3 Building Tags: " + _getByteText(gloaded[0]) + " / " + _getByteText(gloaded[1]);
				this.messageStatus[1] = 1000;
				this.messageStatus[2] = Date.now();
				this.messageStatus[3] = true;
			}
			if (this._displayMessage[0] == 1) {
				if (!this.flash.isPlaying) {
					this._displayMessage[2] = Date.now();
				}
				if (this.flash.isPlaying) {
					this._displayMessage[1] = "Play";
				} else {
					this._displayMessage[1] = "Pause";
				}
			}
			var rrgg = Date.now() - this._displayMessage[2] < this._displayMessage[3];
			if (this._displayMessage[0] && rrgg) {
				var GSGGG = this._displayMessage[1];
				this.statsE_PP.textContent = GSGGG;
				this.statsE_PP.style.display = "inline-block";
			} else {
				if (this._displayMessage[0] !== 1) {
					if (this._displayMessage[0]) {
						if (this.clickToPlayContainer) {
							this._displayMessage[0] = 0;
						} else {
							this._displayMessage[0] = 1;
						}
					}
				}
				this.statsE_PP.style.display = "none";
			}
			var clip = this.flash.getRootClip();
			if (clip) {
				this.__a2.textContent = clip.currentFrame() + "/" + clip.totalframes();
				if (clip.totalframes() > 1) {
					this.__fdfj.min = 1;
					this.__fdfj.max = clip.totalframes();
					this.__fdfj.value = clip.currentFrame();
					this.__fdfj.disabled = false;
				} else {
					this.__fdfj.min = 1;
					this.__fdfj.max = 2;
					this.__fdfj.disabled = true;
				}
			}
		} else {
			this.startTime = Date.now();
			this.startTime2 = Date.now();
			this.__fdfj.min = 1;
			this.__fdfj.max = 2;
			this.__fdfj.disabled = true;
		}
		if (this._viewFrame && this.flash) {
			var clip = this.flash.getRootClip();
			if (clip) {
				var _r =
					_getDuraction(
						(clip.currentFrame() / clip.framesloaded()) *
							(clip.framesloaded() / this.flash.frameRate)
					) +
					"/" +
					_getDuraction(clip.framesloaded() / this.flash.frameRate);
				var _u = clip.currentFrame() + "/" + clip.framesloaded();
				var hkj = "Time: " + _r;
				hkj += "<br>Frame: " + _u;
				this.statsE_R.style.display = "";
				this.statsE_R.innerHTML = hkj;
			}
		} else {
			this.statsE_R.style.display = "none";
		}
		if (this.isPlayMovie()) {
			this.movie_playStop.innerHTML = "Stop";
		} else {
			this.movie_playStop.innerHTML = "Play";
		}
		if (
			this.messageStatus[3] &&
			Date.now() - this.messageStatus[2] > this.messageStatus[1]
		) {
			this.messageE.style.display = "none";
		} else {
			this.messageContentE.textContent = this.messageStatus[0];
			this.messageE.style.display = "";
		}
	};
	PinkFiePlayer.prototype.viewStats = function () {
		if (this._viewFrame) {
			this._viewFrame = false;
		} else {
			this._viewFrame = true;
		}
	};
	PinkFiePlayer.prototype.setFlashPlayer = function (flash) {
		this.flash = flash;
		this.flash.isPlaying = this.options.autoplay;
		this.statsE.style.display = "";
		this.playerContainer.insertBefore(flash.canvas, this.playerContainer.childNodes[0]);
		this.applyOptionsToFlash();
		this.applyResizeFlashPlayer();
		this.onload.emit(flash);
		this.applyAutoplayPolicy(this.flash.isPlaying);
	};
	PinkFiePlayer.prototype.applyOptionsToFlash = function () {
		if (this.flash) {
			this.flash.setVolume(this.options.volume / 100);
			var renderDirty = false;
			if (this.flash.getQuality() != this.options.quality) {
				this.flash.setQuality(this.options.quality);
				renderDirty = true;
			}
			if (renderDirty) this.applyResizeFlashPlayer();
		}
	};
	PinkFiePlayer.prototype.applyResizeFlashPlayer = function () {
		if (this.flash) {
			this.flash.resize(this._width, this._height);
			var rect = this.getRectStage();
			var canvas = this.flash.canvas;
			canvas.style.margin = "0";
			canvas.style.position = "absolute";
			canvas.style.left = rect[0] + "px";
			canvas.style.top = rect[1] + "px";
			canvas.style.width = rect[2] + "px";
			canvas.style.height = rect[3] + "px";
			this.debugCanvas.style.left = rect[0] + "px";
			this.debugCanvas.style.top = rect[1] + "px";
			this.debugCanvas.width = canvas.width;
			this.debugCanvas.height = canvas.height;
			this.debugCanvas.style.height = rect[3] + "px";
			this.debugCanvas.style.width = rect[2] + "px";
			this.statsE.style.left = rect[0] + "px";
			this.statsE.style.top = rect[1] + "px";
		}
	};
	PinkFiePlayer.prototype.resize = function (w, h) {
		this.width = w;
		this.height = h;
		if (!this.fullscreenEnabled) this._resize(w, h);
	};
	PinkFiePlayer.prototype._resize = function (w, h) {
		this._width = w;
		this._height = h;
		this.playerContainer.style.width = w + "px";
		this.playerContainer.style.height = h + "px";
		this.applyResizeFlashPlayer();
	};
	PinkFiePlayer.prototype.fetchSwfMd5 = function(md5, callback, callbackProgress) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function () {
			callback(new Uint8Array(xhr.response.slice(0x2c)));
		};
		xhr.onprogress = function (e) {
			if (callbackProgress) callbackProgress(e.loaded / e.total);
		};
		xhr.onerror = function () {
			callback(null);
		};
		xhr.responseType = "arraybuffer";
		xhr.open("GET", "https://assets.scratch.mit.edu/internalapi/asset/" + md5 + ".wav/get/");
		xhr.send();
	}
	PinkFiePlayer.prototype.fetchSwfUrl = function (url, callback, callbackProgress) {
		var _this = this;
		var xhr = new XMLHttpRequest();
		if (Array.isArray(url)) {
			var result = [];
			var id_md5 = 0;
			function _excgfd() {
				if (result.length > 1) {
					var len = 0;
					for (var i = 0; i < result.length; i++) 
						len += result[i].length;
					var res = new Uint8Array(len);
					var offest = 0;
					for (var i = 0; i < result.length; i++) {
						res.set(result[i], offest);
						offest += result[i].length;
					}
					callback(new Blob([res]), null);
				} else {
					callback(new Blob([result[0]]), null);
				}
			}
			function _next() {
				_this.fetchSwfMd5(url[id_md5], function(res) {
					if (!res) {
						callback(null, "failed md5: " + url[id_md5]);
						return;
					}
					id_md5++;
					result.push(res);
					if (id_md5 >= url.length) {
						_excgfd();
					} else {
						_next();
					}
				}, function(_p) {
					if (callbackProgress) callbackProgress((id_md5 / url.length) + (_p / url.length));
				});
			}
			_next();
		} else {
			xhr.onload = function () {
				if (xhr.status !== 200) {
					callback(null, xhr.status || xhr.statusText);
				} else {
					var dat = new Uint8Array(xhr.response);
					callback(new Blob([dat]), null);
				}
			};
			xhr.onprogress = function (e) {
				if (callbackProgress) callbackProgress(e.loaded / e.total);
			};
			xhr.onerror = function () {
				callback(null, "unknown");
			};
			xhr.responseType = "arraybuffer";
			xhr.open("GET", url);
			xhr.send();
		}
	};
	PinkFiePlayer.prototype.loadSwfFromFile = function (file) {
		this.beginLoadingSWF();
		this.messageStatus[0] = "\u23F3 Loading SWF Data";
		this.messageStatus[3] = false;
		this.messageE.style.display = "";
		this.messageContentE.textContent = "\u23F3 Loading SWF Data";
		this.loadLoader(file);
	};
	PinkFiePlayer.prototype.loadLoader = function (file) {
		this.messageStatus[0] = "\u23F3 Descompressing SWF";
		this.messageStatus[3] = false;
		this.messageE.style.display = "";
		this.messageContentE.textContent = this.messageStatus[0];
		var _this = this;
		var flash = new Player();
		flash.build();
		flash.callback = function () {
			_this.setFlashPlayer(flash);
		};
		var r = new FileReader();
		r.onload = function (e) {
			flash.loadSwfData(e.target.result);
		};
		r.readAsArrayBuffer(file);
	};
	PinkFiePlayer.prototype.loadSwfFromURL = function (url) {
		this.beginLoadingSWF();
		this.messageStatus[0] = "\u23F3 Loading SWF Data";
		this.messageStatus[3] = false;
		this.messageE.style.display = "";
		var _this = this;
		this.fetchSwfUrl(url, function (file, status) {
			_this.swfData = file;
			if (file) {
				_this.loadLoader(file);
			} else {
				_this.messageStatus[0] = "Failed to load SWF: " + status;
				_this.messageStatus[3] = false;
				_this.messageE.style.display = "";
				_this.messageContentE.textContent = _this.messageStatus[0];
			}
		}, function(e) {
			_this.messageStatus[0] = "\u23F3 Loading SWF Data " + Math.round(e * 100) + "%";
			_this.messageStatus[3] = false;
		});
	};
	PinkFiePlayer.prototype.showSetting = function () {
		this.settingVertical.style.display = "";
	};
	PinkFiePlayer.prototype.getSwfName = function () {
		var swf = this.flash.swf;
		return ("pinkfie_" + swf.header.compression + "_" + swf.version + "_" + swf.uncompressedLength + "_fps" + swf.frameRate + "_frames" + swf.numFrames);
	};
	PinkFiePlayer.prototype.saveScreenshot = function () {
		if (!this.hasFlash()) return;
		var _movieCanvas = this.flash.canvas;
		var j = this.getSwfName();
		var h = this.scanned.scan(_movieCanvas);
		var a = document.createElement("a");
		a.href = h;
		a.download = j + ".png";
		a.click();
	};
	PinkFiePlayer.prototype.downloadSwf = function () {
		if (!this.hasFlash()) return;
		var j = this.getSwfName();
		var h = URL.createObjectURL(this.swfData);
		var a = document.createElement("a");
		a.href = h;
		a.download = j + ".swf";
		a.click();
	};
	PinkFiePlayer.prototype.toggleRunning = function () {
		if (this.flash) {
			if (this.clickToPlayContainer) this.removeClickToPlayContainer();
			this._displayMessage[0] = 1;
			this.flash.setPlaying(!this.flash.isPlaying);
		}
	};
	PinkFiePlayer.prototype.isPlayMovie = function () {
		if (!this.hasFlash()) return false;
		if (this.flash.getRootClip()) return this.flash.getRootClip().isPlaying();
		return false;
	};
	PinkFiePlayer.prototype.c_playStop = function () {
		if (!this.hasFlash()) return;
		this.flash.mutateWithUpdateContext((context) => {
			this.flash.togglePlayRootMovie(context);
		});
	};
	PinkFiePlayer.prototype.c_rewind = function () {
		if (!this.hasFlash()) return;
		this.flash.mutateWithUpdateContext((context) => {
			this.flash.rewindRootMovie(context);
		});
	};
	PinkFiePlayer.prototype.c_Forward = function () {
		if (!this.hasFlash()) return;
		this.flash.mutateWithUpdateContext((context) => {
			this.flash.forwardRootMovie(context);
		});
	};
	PinkFiePlayer.prototype.c_Back = function () {
		if (!this.hasFlash()) return;
		this.flash.mutateWithUpdateContext((context) => {
			this.flash.backRootMovie(context);
		});
	};
	PinkFiePlayer.prototype.c_gotoFrame = function (frame, stop) {
		if (!this.hasFlash()) return;
		this.flash.mutateWithUpdateContext((context) => {
			this.flash.getRootClip().gotoFrame(context, frame, stop);
		});
	};
	PinkFiePlayer.prototype.beginLoadingSWF = function () {
		this.cleanup();
		this.onstartload.emit();
	};
	PinkFiePlayer.prototype.applyAutoplayPolicy = function (policy) {
		if (policy) {
			this.triggerStartMovie();
		} else {
			this.showClickToPlayContainer();
		}
	};
	PinkFiePlayer.prototype.triggerStartMovie = function () {
		this.flash.setPlaying(true);
		if (this.clickToPlayContainer) this.removeClickToPlayContainer();
	};
	PinkFiePlayer.prototype.showClickToPlayContainer = function () {
		if (!this.clickToPlayContainer) {
			this.clickToPlayContainer = document.createElement("div");
			this.clickToPlayContainer.className =
				"pinkfie-player-click-to-play-container";
			this.clickToPlayContainer.onclick = () => {
				this.removeClickToPlayContainer();
				this.triggerStartMovie();
			};
			const content = document.createElement("div");
			content.className = "pinkfie-player-click-to-play-icon";
			this.clickToPlayContainer.appendChild(content);
			this.playerContainer.insertBefore(
				this.clickToPlayContainer,
				this.playerContainer.childNodes[2]
			);
		}
	};
	PinkFiePlayer.prototype.removeClickToPlayContainer = function () {
		if (this.clickToPlayContainer) {
			this.playerContainer.removeChild(this.clickToPlayContainer);
			this.clickToPlayContainer = null;
		}
	};
	PinkFiePlayer.prototype.cleanup = function () {
		this.isError = false;
		this.debugCanvas.style.display = "none";
		if (this.clickToPlayContainer) this.removeClickToPlayContainer();
		if (this.flash) {
			this.flash.destroy();
			this.playerContainer.removeChild(this.flash.canvas);
			this.flash = null;
		}
		this._displayMessage[0] = 0;
		this.swfData = null;
		this.oncleanup.emit();
	};
	PinkFiePlayer.DEFAULT_OPTIONS = {
		volume: 100,
		quality: "high",
		autoplay: true,
		rendermode: 0,
	};

	return {
		createPlayer: function() {
			return new PinkFiePlayer();
		},
		SwfInput
	}
}());

/*
 * AT H.263 Decoder
 *
 * credit at source: https://github.com/ruffle-rs/h263-rs
 * 
 * (c) 2024 ATFSMedia Studio.
 */

var AT_H263_Decoder = (function() {
	const saturatingSub = function(a, b) {
		return a - b;
	}
	const checked_shl = function(a, b) {
		
	}
	const checked_shr = function(a, b) {
		// body...
	}
	const asU8 = function(num) {
		return (num << 24) >>> 24;
	}
	const asI8 = function(num) {
		return (num << 24) >> 24;
	}
	const asU16 = function(num) {
		return (num << 16) >>> 16;
	}
	const asI16 = function(num) {
		return (num << 16) >> 16;
	}
	const asU32 = function(num) {
		return num >>> 0;
	}
	const asI32 = function(num) {
		return num | 0;
	}
	const is_gob_error = function(type) {
		return (type == "InvalidGobHeader");
	}
	const is_macroblock_error = function(type) {
		return (type == "InvalidMacroblockCodedBits") || (type == "InvalidMacroblockHeader");
	}
	const is_eof_error = function(type) {
		return (type == "EndOfFile") || (type == "_");
	}

	const Picture = function() {
		this.version = 0; // u8
		this.temporal_reference = 0; // u16
		this.format = null; // SourceFormat
		this.options = null; // PictureOption
		this.has_plusptype = false; // bool
		this.has_opptype = false; // bool
		this.picture_type = null; // PictureTypeCode
		this.motion_vector_range = null; // MotionVectorRange
		this.slice_submode = null; // SliceSubmode
		this.scalability_layer = null; // ScalabilityLayer
		this.reference_picture_selection_mode = null; // ReferencePictureSelectionMode
		this.prediction_reference = 0; // u16
		this.backchannel_message = null; // BackchannelMessage
		this.reference_picture_resampling = null; // ReferencePictureResampling
		this.quantizer = 0; // u8
		this.multiplex_bitstream = 0; // u8
		this.pb_reference = 0; // u8
		this.pb_quantizer = null; // BPictureQuantizer
		this.extra = []; // Vec u8
	};

	const PixelAspectRatio = function(type, value) {
		this.type = type;
		this.value = (value || null);
	}
	PixelAspectRatio.Square = 1;
	PixelAspectRatio.Par12_11 = 2;
	PixelAspectRatio.Par10_11 = 3;
	PixelAspectRatio.Par16_11 = 4;
	PixelAspectRatio.Par40_33 = 5;
	PixelAspectRatio.Reserved = 6; // u8
	PixelAspectRatio.Extended = 7; // { parWidth: u8, parHeight: u8 }

	const CustomPictureFormat = function(pixelAspectRatio, pictureWidthIndication, pictureHeightIndication) {
		this.pixelAspectRatio = pixelAspectRatio;
		this.pictureWidthIndication = pictureWidthIndication;
		this.pictureHeightIndication = pictureHeightIndication;
	}

	const MotionVectorRange = function(type) {
		this.type = type;
	}
	MotionVectorRange.Extended = 0;
	MotionVectorRange.Unlimited = 1;

	const SourceFormat = function(type, value) {
		this.type = type;
		this.value = (value || null);
	}

	SourceFormat.SubQcif = 1;
	SourceFormat.QuarterCif = 2;
	SourceFormat.FullCif = 3;
	SourceFormat.FourCif = 4;
	SourceFormat.SixteenCif = 5;
	SourceFormat.Reserved = 6;
	SourceFormat.Extended = 7; // value CustomPictureFormat

	SourceFormat.prototype.intoWidthAndHeight = function() {
		switch(this.type) {
			case SourceFormat.SubQcif:
				return [128, 96];
			case SourceFormat.QuarterCif:
				return [176, 144];
			case SourceFormat.FullCif:
				return [352, 288];
			case SourceFormat.FourCif:
				return [704, 576];
			case SourceFormat.SixteenCif:
				return [1408, 1152];
			case SourceFormat.Reserved:
				return null;
			case SourceFormat.Extended:
				return [this.value.pictureWidthIndication, this.value.pictureHeightIndication];
		}
	}

	const PictureTypeCode = function(type, value) {
		this.type = type;
		this.value = value;
	}
	PictureTypeCode.IFrame = 1;
	PictureTypeCode.PFrame = 2;
	PictureTypeCode.PbFrame = 3;
	PictureTypeCode.ImprovedPbFrame = 4;
	PictureTypeCode.BFrame = 5;
	PictureTypeCode.EiFrame = 6;
	PictureTypeCode.EpFrame = 7;
	PictureTypeCode.Reserved = 8; // u8
	PictureTypeCode.DisposablePFrame = 9;

	PictureTypeCode.prototype.is_any_pbframe = function() {
		return (this.type == PictureTypeCode.PbFrame) || (this.type == PictureTypeCode.ImprovedPbFrame);
	}
	PictureTypeCode.prototype.is_disposable = function() {
		return this.type == PictureTypeCode.DisposablePFrame;
	}
	PictureTypeCode.prototype.getType = function() {
		switch(this.type) {
			case PictureTypeCode.IFrame:
				return "IFrame";
			case PictureTypeCode.PFrame:
				return "PFrame";
			case PictureTypeCode.PbFrame:
				return "PbFrame";
			case PictureTypeCode.EiFrame:
				return "EiFrame";
			case PictureTypeCode.EpFrame:
				return "EpFrame";
			case PictureTypeCode.Reserved:
				return "Reserved";
			case PictureTypeCode.DisposablePFrame:
				return "DisposablePFrame";
		}
	}

	const DecodedDctBlock = function(type, value) {
		this.type = type;
		this.value = value;
	}
	DecodedDctBlock.Zero = 1;
	DecodedDctBlock.Dc = 2; // f32
	DecodedDctBlock.Horiz = 3; // [f32; 8]
	DecodedDctBlock.Vert = 4; // [f32; 8]
	DecodedDctBlock.Full = 5; // [[f32; 8]; 8]

	const PictureOption = function() {
		this.USE_SPLIT_SCREEN = false;
		this.USE_DOCUMENT_CAMERA = false;
		this.RELEASE_FULL_PICTURE_FREEZE = false;
		this.UNRESTRICTED_MOTION_VECTORS = false;
		this.SYNTAX_BASED_ARITHMETIC_CODING = false;
		this.ADVANCED_PREDICTION = false;
		this.ADVANCED_INTRA_CODING = false;
		this.DEBLOCKING_FILTER = false;
		this.SLICE_STRUCTURED = false;
		this.REFERENCE_PICTURE_SELECTION = false;
		this.INDEPENDENT_SEGMENT_DECODING = false;
		this.ALTERNATIVE_INTER_VLC = false;
		this.MODIFIED_QUANTIZATION = false;
		this.REFERENCE_PICTURE_RESAMPLING = false;
		this.REDUCED_RESOLUTION_UPDATE = false;
		this.ROUNDING_TYPE_ONE = false;
		this.USE_DEBLOCKER = false;
	}
	PictureOption.empty = function() {
		return new PictureOption();
	}

	function decodeSorensonPType(reader) {
		// with_transaction
		var source_format, bit_count;

		var dgf = reader.readBits(3);

		switch(dgf) {
			case 0:
				source_format = null;
				bit_count = 8;
				break;
			case 1:
				source_format = null;
				bit_count = 16;
				break;
			case 2:
				source_format = new SourceFormat(SourceFormat.FullCif);
				bit_count = 0;
				break;
			case 3:
				source_format = new SourceFormat(SourceFormat.QuarterCif);
				bit_count = 0;
				break;
			case 4:
				source_format = new SourceFormat(SourceFormat.SubQcif);
				bit_count = 0;
				break;
			case 5:
				source_format = new SourceFormat(SourceFormat.Extended, new CustomPictureFormat(new PixelAspectRatio(PixelAspectRatio.Square), 320, 240));
				bit_count = 0;
				break;
			case 6:
				source_format = new SourceFormat(SourceFormat.Extended, new CustomPictureFormat(new PixelAspectRatio(PixelAspectRatio.Square), 160, 120));
				bit_count = 0;
				break;
			default:
				source_format = new SourceFormat(SourceFormat.Reserved);
				bit_count = 0;
		}
		if (source_format === null) { // source_format.is_none()
			let customWidth = reader.readBits(bit_count);
			let customHeight = reader.readBits(bit_count);

			source_format = new SourceFormat(SourceFormat.Extended, new CustomPictureFormat(new PixelAspectRatio(PixelAspectRatio.Square), customWidth, customHeight));
		}

		var fdgd = reader.readBits(2);

		var pictureType;
		switch(fdgd) {
			case 0:
				pictureType = new PictureTypeCode(PictureTypeCode.IFrame);
				break;
			case 1:
				pictureType = new PictureTypeCode(PictureTypeCode.PFrame);
				break;
			case 2:
				pictureType = new PictureTypeCode(PictureTypeCode.DisposablePFrame);
				break;
			default:
				pictureType = new PictureTypeCode(PictureTypeCode.Reserved, fdgd);
				break;
		}

		let options = PictureOption.empty();

		if (asU8(reader.readBits(1)) == 1) {
			options.USE_DEBLOCKER = true;
		}

		return [source_format, pictureType, options];
	}

	const DecodedPicture = function(picture_header, format) {
		let [w, h] = format.intoWidthAndHeight();

		let luma_samples = w * h;
		let luma = new Uint8Array(luma_samples);

		let chroma_w = Math.ceil(w / 2.0);
		let chroma_h = Math.ceil(h / 2.0);

		let chroma_samples = chroma_w * chroma_h;

		let chroma_b = new Uint8Array(chroma_samples);
		let chroma_r = new Uint8Array(chroma_samples);

		this.picture_header = picture_header; // Picture
		this.format = format; // SourceFormat
		this.luma = luma; // Vec u8
		this.chroma_b = chroma_b; // Vec u8
		this.chroma_r = chroma_r; // Vec u8
		this.chroma_samples_per_row = chroma_w;
	}
	DecodedPicture.prototype.as_yuv = function() {
		return [this.luma, this.chroma_b, this.chroma_r];
	}
	DecodedPicture.prototype.as_header = function() {
		return this.picture_header;
	}
	DecodedPicture.prototype.as_luma_mut = function() {
		return this.luma;
	}
	DecodedPicture.prototype.as_chroma_b_mut = function() {
		return this.chroma_b;
	}
	DecodedPicture.prototype.as_chroma_r_mut = function() {
		return this.chroma_r;
	}
	DecodedPicture.prototype.as_luma = function() {
		return this.luma;
	}
	DecodedPicture.prototype.as_chroma_b = function() {
		return this.chroma_b;
	}
	DecodedPicture.prototype.as_chroma_r = function() {
		return this.chroma_r;
	}
	DecodedPicture.prototype.luma_samples_per_row = function() {
		return this.format.intoWidthAndHeight()[0];
	}
	function decodePei(reader) {
		var data = [];
		while(true) {
			var hasPei = reader.readBits(1);
			if (hasPei == 1) {
				data.push(reader.readUint8());
			} else {
				break;
			}
		}
		return data;
	}

	function decodePicture(reader, decoderOptions, previous_picture) {
		//with_transaction_union

		var skippedBits = reader.recognizeStartCode(false);
		reader.skipBits(17 + skippedBits);
		var gob_id = reader.readBits(5);
		if (decoderOptions.sorensonSpark) {
			var temporalReference = reader.readUint8();
			var [source_format, pictureType, options] = decodeSorensonPType(reader);
			var quantizer = reader.readBits(5);
			var extra = decodePei(reader);
			var result = new Picture();

			result.version = gob_id;
			result.temporal_reference = temporalReference;
			result.format = source_format;
			result.options = options;
			result.has_plusptype = false;
			result.has_opptype = false;
			result.picture_type = pictureType;
			result.quantizer = quantizer;
			result.extra = extra;

			result.motion_vector_range = new MotionVectorRange(MotionVectorRange.Unlimited);

			result.slice_submode = null;
			result.scalability_layer = null;
			result.reference_picture_selection_mode = null;
			result.prediction_reference = null;
			result.backchannel_message = null;
			result.reference_picture_resampling = null;
			result.multiplex_bitstream = null;
			result.pb_reference = null;
			result.pb_quantizer = null;

			return result;
		}
	}

	const CodedBlockPattern = function(codes_luma, codes_chroma_b, codes_chroma_r) {
		this.codes_luma = codes_luma;
		this.codes_chroma_b = codes_chroma_b;
		this.codes_chroma_r = codes_chroma_r;
	}

	function op_cmp(a, b) {
		if (a > b) {
			return "greater";
		} else if (a < b) {
			return "less";
		} else {
			return "equal";
		}
	}

	const HalfPel = function(n) {
		this.n = n; // i16
	}
	HalfPel.zero = function() {
		return new HalfPel(0);
	}
	HalfPel.from = function(float) {
		return new HalfPel(asI16(Math.floor(float * 2))); // TODO ((float * 2.0).floor() as i16)
	}
	HalfPel.from_unit = function(unit) {
		return new HalfPel(asI16(unit));
	}
	HalfPel.prototype.is_mv_within_range = function(range) {
		return -range.n <= this.n && this.n < range.n;
	}
	HalfPel.prototype.invert = function() {
		switch(op_cmp(this.n, 0)) {
			case "greater":
				return new HalfPel(this.n - 64);
			case "less":
				return new HalfPel(this.n + 64);
			case "equal":
				return this;
		}
	}
	HalfPel.prototype.average_sum_of_mvs = function() {
		let whole = (this.n >> 4) << 1; // div 8
		let frac = this.n & 0x0F;
		if (asfgdgdfg(frac, 0, 2)) {
			return new HalfPel(whole);
		} else if (asfgdgdfg(frac, 14, 15)) {
			return new HalfPel(whole + 2);
		} else {
			return new HalfPel(whole + 1);
		} 
	}
	HalfPel.prototype.median_of = function(mhs, rhs) {
		var num_self = this.n;
		var num_mhs = mhs.n;
		var num_rhs = rhs.n;
		if (num_self > num_mhs) {
			if (num_rhs > num_mhs) {
				if (num_rhs > num_self) {
					return this;
				} else {
					return rhs;
				}
			} else {
				return mhs;
			}
		} else if (num_mhs > num_rhs) {
			if (num_rhs > num_self) {
				return rhs;
			} else {
				return this;
			}
		} else {
			return mhs;
		}
	}
	HalfPel.prototype.into_lerp_parameters = function() {
		if (this.n % 2 == 0) {
			return [asI16(this.n / 2), false];
		} else if (this.n < 0) {
			return [asI16(this.n / 2 - 1), true];
		} else {
			return [asI16(this.n / 2), true];
		}
	}
	HalfPel.STANDARD_RANGE = new HalfPel(32);
	HalfPel.EXTENDED_RANGE = new HalfPel(64);
	HalfPel.EXTENDED_RANGE_QUADCIF = new HalfPel(128);
	HalfPel.EXTENDED_RANGE_SIXTEENCIF = new HalfPel(256);
	HalfPel.EXTENDED_RANGE_BEYONDCIF = new HalfPel(512);

	const MotionVector = function(n1, n2) {
		this.n1 = n1;
		this.n2 = n2;
	}
	MotionVector.zero = function() {
		return new MotionVector(HalfPel.zero(), HalfPel.zero());
	}
	MotionVector.prototype.median_of = function(mhs, rhs) {
		return new MotionVector(
			this.n1.median_of(mhs.n1, rhs.n1),
			this.n2.median_of(mhs.n2, rhs.n2)
		);
	}
	MotionVector.prototype.into_lerp_parameters = function() {
		return [this.n1.into_lerp_parameters(), this.n2.into_lerp_parameters()];
	}
	MotionVector.prototype.add = function(rhs) {
		var g1 = asI16(this.n1.n + rhs.n1.n);
		var g2 = asI16(this.n2.n + rhs.n2.n);
		return new MotionVector(new HalfPel(g1), new HalfPel(g2));
	}
	MotionVector.prototype.average_sum_of_mvs = function() {
		return new MotionVector(this.n1.average_sum_of_mvs(), this.n2.average_sum_of_mvs());
	}

	const IntraDc = function(n) {
		this.n = n; // u8
	}
	IntraDc.from_u8 = function(value) {
		if (value == 0 || value == 128) {
			return null;
		} else {
			return new IntraDc(value);
		}
	}
	IntraDc.prototype.into_level = function() {
		if (this.n == 0xFF) {
			return 1024;
		} else {
			return asI16(asI16(asU16(this.n)) << 3);
		}
	}

	const TCoefficient = function(is_short, run, level) {
		this.is_short = is_short;
		this.run = run;
		this.level = level;
	}

	const Block = function(intradc, tcoef) {
		this.intradc = intradc;
		this.tcoef = tcoef;
	}

	const VlcEntry = function(type, value) {
		this.type = type;
		this.value = value;
	}
	VlcEntry.End = 1;
	VlcEntry.Fork = 2;

	const MacroblockType = function(type) {
		this.type = type;
	}
	MacroblockType.Inter = 1;
	MacroblockType.InterQ = 2;
	MacroblockType.Inter4V = 3;
	MacroblockType.Intra = 4;
	MacroblockType.IntraQ = 5;
	MacroblockType.Inter4Vq = 6;
	MacroblockType.prototype.is_inter = function() {
		return this.type == MacroblockType.Inter || this.type == MacroblockType.InterQ || this.type == MacroblockType.Inter4V || this.type == MacroblockType.Inter4Vq;
	}
	MacroblockType.prototype.is_intra = function() {
		return (this.type == MacroblockType.Intra) || (this.type == MacroblockType.IntraQ);
	}
	MacroblockType.prototype.has_fourvec = function() {
		return this.type == MacroblockType.Inter4V || this.type == MacroblockType.Inter4Vq;
	}
	MacroblockType.prototype.has_quantizer = function() {
		return this.type == MacroblockType.InterQ || this.type == MacroblockType.IntraQ || this.type == MacroblockType.Inter4Vq;
	}

	const Macroblock = function(type, value) {
		this.type = type;
		this.value = value;
	}
	Macroblock.Uncoded = 1;
	Macroblock.Stuffing = 2;
	Macroblock.Coded = 3;
	Macroblock.prototype.macroblock_type = function() {

	}

	const BlockPatternEntry = function(type, value) {
		this.type = type;
		this.value = value;
	}
	BlockPatternEntry.Stuffing = 1;
	BlockPatternEntry.Invalid = 2;
	BlockPatternEntry.Valid = 3; // (MacroblockType, bool, bool)

	const MCBPC_I_TABLE = [
		new VlcEntry(VlcEntry.Fork, [2, 1]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(
			BlockPatternEntry.Valid,
			[new MacroblockType(MacroblockType.Intra), false, false]
		)),
		new VlcEntry(VlcEntry.Fork, [6, 3]),
		new VlcEntry(VlcEntry.Fork, [4, 5]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(
			BlockPatternEntry.Valid,
			[new MacroblockType(MacroblockType.Intra), true, false]
		)),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(
			BlockPatternEntry.Valid,
			[new MacroblockType(MacroblockType.Intra), true, true]
		)),
		new VlcEntry(VlcEntry.Fork, [8, 7]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Intra),
				false,
				true
			]
		)),
		new VlcEntry(VlcEntry.Fork, [10, 9]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.IntraQ),
				false,
				false
			]
		)),
		new VlcEntry(VlcEntry.Fork, [14, 11]),
		new VlcEntry(VlcEntry.Fork, [12, 13]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.IntraQ),
				true,
				false
			]
		)),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.IntraQ),
				true,
				true
			]
		)),
		new VlcEntry(VlcEntry.Fork, [16, 20]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Invalid)),
		new VlcEntry(VlcEntry.Fork, [17, 15]),
		new VlcEntry(VlcEntry.Fork, [18, 15]),
		new VlcEntry(VlcEntry.Fork, [15, 19]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Stuffing)),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.IntraQ),
				false,
				true
			]
		)),
	];
	const MCBPC_P_TABLE = [
		new VlcEntry(VlcEntry.Fork, [2, 1]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Inter),
				false,
				false
			]
		)),
		new VlcEntry(VlcEntry.Fork, [6, 3]),
		new VlcEntry(VlcEntry.Fork, [4, 5]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Inter4V),
				false,
				false
			]
		)),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.InterQ),
				false,
				false
			]
		)),
		new VlcEntry(VlcEntry.Fork, [10, 7]),
		new VlcEntry(VlcEntry.Fork, [8, 9]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Inter),
				true,
				false
			]
		)),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Inter),
				false,
				true
			]
		)),
		new VlcEntry(VlcEntry.Fork, [16, 11]),
		new VlcEntry(VlcEntry.Fork, [13, 12]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Intra),
				false,
				false
			]
		)),
		new VlcEntry(VlcEntry.Fork, [14, 15]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.IntraQ),
				false,
				false
			]
		)),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Inter),
				true,
				true
			]
		)),
		new VlcEntry(VlcEntry.Fork, [24, 17]),
		new VlcEntry(VlcEntry.Fork, [18, 21]),
		new VlcEntry(VlcEntry.Fork, [19, 20]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Inter4V),
				true,
				false
			]
		)),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Inter4V),
				false,
				true
			]
		)),
		new VlcEntry(VlcEntry.Fork, [22, 23]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.InterQ),
				true,
				false
			]
		)),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.InterQ),
				false,
				true
			]
		)),
		new VlcEntry(VlcEntry.Fork, [30, 25]),
		new VlcEntry(VlcEntry.Fork, [27, 26]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Intra),
				true,
				true
			]
		)),
		new VlcEntry(VlcEntry.Fork, [28, 29]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Intra),
				false,
				true
			]
		)),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Inter4V),
				true,
				true
			]
		)),
		new VlcEntry(VlcEntry.Fork, [36, 31]),
		new VlcEntry(VlcEntry.Fork, [33, 32]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Intra),
				true,
				false
			]
		)),
		new VlcEntry(VlcEntry.Fork, [34, 35]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.IntraQ),
				false,
				true
			]
		)),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.InterQ),
				true,
				true
			]
		)),
		new VlcEntry(VlcEntry.Fork, [40, 37]),
		new VlcEntry(VlcEntry.Fork, [38, 39]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.IntraQ),
				true,
				true
			]
		)),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.IntraQ),
				true,
				false
			]
		)),
		new VlcEntry(VlcEntry.Fork, [42, 41]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Stuffing)),
		new VlcEntry(VlcEntry.Fork, [43, 44]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Invalid)),
		new VlcEntry(VlcEntry.Fork, [45, 46]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Inter4Vq),
				false,
				false
			]
		)),
		new VlcEntry(VlcEntry.Fork, [47, 50]),
		new VlcEntry(VlcEntry.Fork, [48, 49]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Inter4Vq),
				false,
				true
			]
		)),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Invalid)),
		new VlcEntry(VlcEntry.Fork, [51, 52]),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Inter4Vq),
				true,
				false
			]
		)),
		new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid,
			[
				new MacroblockType(MacroblockType.Inter4Vq),
				true,
				true
			]
		)),
	];

	const MODB_TABLE = [
		new VlcEntry(VlcEntry.Fork, [1, 2]),
		new VlcEntry(VlcEntry.End, [false, false]),
		new VlcEntry(VlcEntry.Fork, [3, 4]),
		new VlcEntry(VlcEntry.End, [false, true]),
		new VlcEntry(VlcEntry.End, [true, true])
	];

	function decode_cbpb(reader) {
		let cbp0 = reader.readBits(1) == 1;
		let cbp1 = reader.readBits(1) == 1;
		let cbp2 = reader.readBits(1) == 1;
		let cbp3 = reader.readBits(1) == 1;
		let cbp4 = reader.readBits(1) == 1;
		let cbp5 = reader.readBits(1) == 1;
		return new CodedBlockPattern([cbp0, cbp1, cbp2, cbp3], cbp4, cbp5);
	}

	const CBPY_TABLE_INTRA = [
		new VlcEntry(VlcEntry.Fork, [1, 24]),
		new VlcEntry(VlcEntry.Fork, [2, 17]),
		new VlcEntry(VlcEntry.Fork, [3, 12]),
		new VlcEntry(VlcEntry.Fork, [4, 9]),
		new VlcEntry(VlcEntry.Fork, [5, 6]),
		new VlcEntry(VlcEntry.End, null), // not a valid prefix
		new VlcEntry(VlcEntry.Fork, [7, 8]),
		new VlcEntry(VlcEntry.End, [false, true, true, false]),
		new VlcEntry(VlcEntry.End, [true, false, false, true]),
		new VlcEntry(VlcEntry.Fork, [10, 11]),
		new VlcEntry(VlcEntry.End, [true, false, false, false]),
		new VlcEntry(VlcEntry.End, [false, true, false, false]),
		new VlcEntry(VlcEntry.Fork, [13, 16]),
		new VlcEntry(VlcEntry.Fork, [14, 15]),
		new VlcEntry(VlcEntry.End, [false, false, true, false]),
		new VlcEntry(VlcEntry.End, [false, false, false, true]),
		new VlcEntry(VlcEntry.End, [false, false, false, false]),
		new VlcEntry(VlcEntry.Fork, [18, 21]),
		new VlcEntry(VlcEntry.Fork, [19, 20]),
		new VlcEntry(VlcEntry.End, [true, true, false, false]),
		new VlcEntry(VlcEntry.End, [true, false, true, false]),
		new VlcEntry(VlcEntry.Fork, [22, 23]),
		new VlcEntry(VlcEntry.End, [true, true, true, false]),
		new VlcEntry(VlcEntry.End, [false, true, false, true]),
		new VlcEntry(VlcEntry.Fork, [25, 32]),
		new VlcEntry(VlcEntry.Fork, [26, 29]),
		new VlcEntry(VlcEntry.Fork, [27, 28]),
		new VlcEntry(VlcEntry.End, [true, true, false, true]),
		new VlcEntry(VlcEntry.End, [false, false, true, true]),
		new VlcEntry(VlcEntry.Fork, [30, 31]),
		new VlcEntry(VlcEntry.End, [true, false, true, true]),
		new VlcEntry(VlcEntry.End, [false, true, true, true]),
		new VlcEntry(VlcEntry.End, [true, true, true, true]),
	];
	function decode_dquant(reader) {
		switch(reader.readBits(2)) {
			case 0:
				return -1;
			case 1:
				return -2;
			case 2:
				return 1;
			case 3:
				return 2;
			default:
				throw new Error("InternalDecoderError");
		}
	}

	const MVD_TABLE = [
		new VlcEntry(VlcEntry.Fork, [2, 1]),
		new VlcEntry(VlcEntry.End, 0.0),
		new VlcEntry(VlcEntry.Fork, [6, 3]),
		new VlcEntry(VlcEntry.Fork, [4, 5]),
		new VlcEntry(VlcEntry.End, 0.5),
		new VlcEntry(VlcEntry.End, -0.5),
		new VlcEntry(VlcEntry.Fork, [10, 7]),
		new VlcEntry(VlcEntry.Fork, [8, 9]),
		new VlcEntry(VlcEntry.End, 1.0),
		new VlcEntry(VlcEntry.End, -1.0),
		new VlcEntry(VlcEntry.Fork, [14, 11]),
		new VlcEntry(VlcEntry.Fork, [12, 13]),
		new VlcEntry(VlcEntry.End, 1.5),
		new VlcEntry(VlcEntry.End, -1.5),
		new VlcEntry(VlcEntry.Fork, [26, 15]),
		new VlcEntry(VlcEntry.Fork, [19, 16]),
		new VlcEntry(VlcEntry.Fork, [17, 18]),
		new VlcEntry(VlcEntry.End, 2.0),
		new VlcEntry(VlcEntry.End, -2.0),
		new VlcEntry(VlcEntry.Fork, [23, 20]),
		new VlcEntry(VlcEntry.Fork, [21, 22]),
		new VlcEntry(VlcEntry.End, 2.5),
		new VlcEntry(VlcEntry.End, -2.5),
		new VlcEntry(VlcEntry.Fork, [24, 25]),
		new VlcEntry(VlcEntry.End, 3.0),
		new VlcEntry(VlcEntry.End, -3.0),
		new VlcEntry(VlcEntry.Fork, [50, 27]),
		new VlcEntry(VlcEntry.Fork, [31, 28]),
		new VlcEntry(VlcEntry.Fork, [29, 30]),
		new VlcEntry(VlcEntry.End, 3.5),
		new VlcEntry(VlcEntry.End, -3.5),
		new VlcEntry(VlcEntry.Fork, [39, 32]),
		new VlcEntry(VlcEntry.Fork, [36, 33]),
		new VlcEntry(VlcEntry.Fork, [34, 35]),
		new VlcEntry(VlcEntry.End, 4.0),
		new VlcEntry(VlcEntry.End, -4.0),
		new VlcEntry(VlcEntry.Fork, [37, 38]),
		new VlcEntry(VlcEntry.End, 4.5),
		new VlcEntry(VlcEntry.End, -4.5),
		new VlcEntry(VlcEntry.Fork, [43, 40]),
		new VlcEntry(VlcEntry.Fork, [41, 42]),
		new VlcEntry(VlcEntry.End, 5.0),
		new VlcEntry(VlcEntry.End, -5.0),
		new VlcEntry(VlcEntry.Fork, [47, 44]),
		new VlcEntry(VlcEntry.Fork, [45, 46]),
		new VlcEntry(VlcEntry.End, 5.5),
		new VlcEntry(VlcEntry.End, -5.5),
		new VlcEntry(VlcEntry.Fork, [48, 49]),
		new VlcEntry(VlcEntry.End, 6.0),
		new VlcEntry(VlcEntry.End, -6.0),
		new VlcEntry(VlcEntry.Fork, [82, 51]),
		new VlcEntry(VlcEntry.Fork, [67, 52]),
		new VlcEntry(VlcEntry.Fork, [60, 53]),
		new VlcEntry(VlcEntry.Fork, [57, 54]),
		new VlcEntry(VlcEntry.Fork, [55, 56]),
		new VlcEntry(VlcEntry.End, 6.5),
		new VlcEntry(VlcEntry.End, -6.5),
		new VlcEntry(VlcEntry.Fork, [58, 59]),
		new VlcEntry(VlcEntry.End, 7.0),
		new VlcEntry(VlcEntry.End, -7.0),
		new VlcEntry(VlcEntry.Fork, [64, 61]),
		new VlcEntry(VlcEntry.Fork, [62, 63]),
		new VlcEntry(VlcEntry.End, 7.5),
		new VlcEntry(VlcEntry.End, -7.5),
		new VlcEntry(VlcEntry.Fork, [65, 66]),
		new VlcEntry(VlcEntry.End, 8.0),
		new VlcEntry(VlcEntry.End, -8.0),
		new VlcEntry(VlcEntry.Fork, [75, 68]),
		new VlcEntry(VlcEntry.Fork, [72, 69]),
		new VlcEntry(VlcEntry.Fork, [70, 71]),
		new VlcEntry(VlcEntry.End, 8.5),
		new VlcEntry(VlcEntry.End, -8.5),
		new VlcEntry(VlcEntry.Fork, [73, 74]),
		new VlcEntry(VlcEntry.End, 9.0),
		new VlcEntry(VlcEntry.End, -9.0),
		new VlcEntry(VlcEntry.Fork, [79, 76]),
		new VlcEntry(VlcEntry.Fork, [77, 78]),
		new VlcEntry(VlcEntry.End, 9.5),
		new VlcEntry(VlcEntry.End, -9.5),
		new VlcEntry(VlcEntry.Fork, [80, 81]),
		new VlcEntry(VlcEntry.End, 10.0),
		new VlcEntry(VlcEntry.End, -10.0),
		new VlcEntry(VlcEntry.Fork, [98, 83]),
		new VlcEntry(VlcEntry.Fork, [91, 84]),
		new VlcEntry(VlcEntry.Fork, [88, 85]),
		new VlcEntry(VlcEntry.Fork, [86, 87]),
		new VlcEntry(VlcEntry.End, 10.5),
		new VlcEntry(VlcEntry.End, -10.5),
		new VlcEntry(VlcEntry.Fork, [89, 90]),
		new VlcEntry(VlcEntry.End, 11.0),
		new VlcEntry(VlcEntry.End, -11.0),
		new VlcEntry(VlcEntry.Fork, [95, 92]),
		new VlcEntry(VlcEntry.Fork, [93, 94]),
		new VlcEntry(VlcEntry.End, 11.5),
		new VlcEntry(VlcEntry.End, -11.5),
		new VlcEntry(VlcEntry.Fork, [96, 97]),
		new VlcEntry(VlcEntry.End, 12.0),
		new VlcEntry(VlcEntry.End, -12.0),
		new VlcEntry(VlcEntry.Fork, [114, 99]),
		new VlcEntry(VlcEntry.Fork, [107, 100]),
		new VlcEntry(VlcEntry.Fork, [104, 101]),
		new VlcEntry(VlcEntry.Fork, [102, 103]),
		new VlcEntry(VlcEntry.End, 12.5),
		new VlcEntry(VlcEntry.End, -12.5),
		new VlcEntry(VlcEntry.Fork, [105, 106]),
		new VlcEntry(VlcEntry.End, 13.0),
		new VlcEntry(VlcEntry.End, -13.0),
		new VlcEntry(VlcEntry.Fork, [111, 108]),
		new VlcEntry(VlcEntry.Fork, [109, 110]),
		new VlcEntry(VlcEntry.End, 13.5),
		new VlcEntry(VlcEntry.End, -13.5),
		new VlcEntry(VlcEntry.Fork, [112, 113]),
		new VlcEntry(VlcEntry.End, 14.0),
		new VlcEntry(VlcEntry.End, -14.0),
		new VlcEntry(VlcEntry.Fork, [122, 115]),
		new VlcEntry(VlcEntry.Fork, [119, 116]),
		new VlcEntry(VlcEntry.Fork, [117, 118]),
		new VlcEntry(VlcEntry.End, 14.5),
		new VlcEntry(VlcEntry.End, -14.5),
		new VlcEntry(VlcEntry.Fork, [120, 121]),
		new VlcEntry(VlcEntry.End, 15.0),
		new VlcEntry(VlcEntry.End, -15.0),
		new VlcEntry(VlcEntry.Fork, [129, 123]),
		new VlcEntry(VlcEntry.Fork, [127, 124]),
		new VlcEntry(VlcEntry.Fork, [125, 126]),
		new VlcEntry(VlcEntry.End, 15.5),
		new VlcEntry(VlcEntry.End, -15.5),
		new VlcEntry(VlcEntry.Fork, [129, 128]),
		new VlcEntry(VlcEntry.End, -16.0),
		new VlcEntry(VlcEntry.End, null)
	];
	function decode_motion_vector(reader, picture, running_options) {
		if (false) {
			let x = reader.read_umv();
			let y = reader.read_umv();
			return new MotionVector(x, y);
		} else {
			var res_x = reader.readVLC(MVD_TABLE);
			var res_Y = reader.readVLC(MVD_TABLE);
			if (res_x === null || res_Y === null) {
				throw new Error("InvalidMvd");
			}
			let x = HalfPel.from(res_x);
			let y = HalfPel.from(res_Y);
			return new MotionVector(x, y);
		}
	}

	function decode_macroblock(reader, picture, running_options) {
		return reader.withTransaction(function(reader) {
			// with_transaction
			let is_coded = 0;
			if (picture.picture_type.type == PictureTypeCode.IFrame) { // matches!(picture.picture_type, PictureTypeCode::IFrame)
				is_coded = 0;
			} else {
				is_coded = reader.readBits(1);
			}

			if (is_coded == 0) {
				var mcbpc = null;

				var picture_type = picture.picture_type;

				switch(picture_type.type) {
					case PictureTypeCode.IFrame:
						mcbpc = reader.readVLC(MCBPC_I_TABLE);
						break;
					case PictureTypeCode.PFrame:
						mcbpc = reader.readVLC(MCBPC_P_TABLE);
						break;
					default:
						throw new Error("UnimplementedDecoding");
				}

				var mb_type = null;
				var codes_chroma_b = null;
				var codes_chroma_r = null;

				switch(mcbpc.type) {
					case BlockPatternEntry.Stuffing:
						return new Macroblock(Macroblock.Stuffing);
					case BlockPatternEntry.Invalid:
						throw new Error("InvalidMacroblockHeader");
					case BlockPatternEntry.Valid:
						mb_type = mcbpc.value[0];
						codes_chroma_b = mcbpc.value[1];
						codes_chroma_r = mcbpc.value[2];
						break;
				}

				var has_cbpb = null;
				var has_mvdb = null;

				if (picture_type.type == PictureTypeCode.PbFrame) {
					var ergf = reader.readVLC(MODB_TABLE);
					has_cbpb = ergf[0];
					has_mvdb = ergf[1];
				} else {
					has_cbpb = false;
					has_mvdb = false;
				}

				let codes_luma = null;
				if (mb_type.is_intra()) {
					var dfgs = reader.readVLC(CBPY_TABLE_INTRA);
					if (dfgs === null)
						throw new Error("InvalidMacroblockCodedBits");
					codes_luma = dfgs;
				} else {
					var dfgs = reader.readVLC(CBPY_TABLE_INTRA);;
					if (dfgs === null)
						throw new Error("InvalidMacroblockCodedBits");
					codes_luma = [!dfgs[0], !dfgs[1], !dfgs[2], !dfgs[3]];
				}

				let coded_block_pattern_b = null;
				if (has_cbpb) {
					coded_block_pattern_b = decode_cbpb(reader);
				}

				let d_quantizer = null;

				if (running_options.MODIFIED_QUANTIZATION) {
					throw new Error("UnimplementedDecoding");
				} else if (mb_type.has_quantizer()) {
					d_quantizer = decode_dquant(reader);
				}

				let motion_vector = null;
				if (mb_type.is_inter() || picture_type.is_any_pbframe()) {
					motion_vector = decode_motion_vector(reader, picture, running_options);
				}

				let addl_motion_vectors = null;
				if (mb_type.has_fourvec()) {
					let mv2 = decode_motion_vector(reader, picture, running_options);
					let mv3 = decode_motion_vector(reader, picture, running_options);
					let mv4 = decode_motion_vector(reader, picture, running_options);
					addl_motion_vectors = [mv2, mv3, mv4];
				}
				let motion_vectors_b = null;
				if (has_mvdb) {
					let mv1 = decode_motion_vector(reader, picture, running_options);
					let mv2 = decode_motion_vector(reader, picture, running_options);
					let mv3 = decode_motion_vector(reader, picture, running_options);
					let mv4 = decode_motion_vector(reader, picture, running_options);
					motion_vectors_b = [mv1, mv2, mv3, mv4];
				}
				return new Macroblock(Macroblock.Coded, {
					mb_type,
					coded_block_pattern: {
						codes_luma,
						codes_chroma_b,
						codes_chroma_r
					},
					coded_block_pattern_b,
					d_quantizer,
					motion_vector,
					addl_motion_vectors,
					motion_vectors_b,
				});
			} else {
				return new Macroblock(Macroblock.Uncoded);
			}
		});
	}

	const ShortTCoefficient = function(type, value) {
		this.type = type;
		this.value = value;
	}
	ShortTCoefficient.EscapeToLong = 1;
	ShortTCoefficient.Run = 2;

	const TCOEF_TABLE = [
		new VlcEntry(VlcEntry.Fork, [8, 1]),
		new VlcEntry(VlcEntry.Fork, [2, 3]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
		last: false,
		run: 0,
		level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [4, 5]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 1,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [6, 7]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 2,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 0,
			level: 2,
		})),
		new VlcEntry(VlcEntry.Fork, [28, 9]),
		new VlcEntry(VlcEntry.Fork, [15, 10]),
		new VlcEntry(VlcEntry.Fork, [12, 11]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 0,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [13, 14]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 4,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 3,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [16, 23]),
		new VlcEntry(VlcEntry.Fork, [17, 20]),
		new VlcEntry(VlcEntry.Fork, [18, 19]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 9,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 8,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [21, 22]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 7,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 6,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [25, 24]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 5,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [26, 27]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 1,
			level: 2,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 0,
			level: 3,
		})),
		new VlcEntry(VlcEntry.Fork, [52, 29]),
		new VlcEntry(VlcEntry.Fork, [37, 30]),
		new VlcEntry(VlcEntry.Fork, [31, 34]),
		new VlcEntry(VlcEntry.Fork, [32, 33]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 4,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 3,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [35, 36]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 2,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 1,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [38, 45]),
		new VlcEntry(VlcEntry.Fork, [39, 42]),
		new VlcEntry(VlcEntry.Fork, [40, 41]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 8,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 7,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [43, 44]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 6,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 5,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [46, 49]),
		new VlcEntry(VlcEntry.Fork, [47, 48]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 12,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 11,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [50, 51]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 10,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 0,
			level: 4,
		})),
		new VlcEntry(VlcEntry.Fork, [90, 53]),
		new VlcEntry(VlcEntry.Fork, [69, 54]),
		new VlcEntry(VlcEntry.Fork, [55, 62]),
		new VlcEntry(VlcEntry.Fork, [56, 59]),
		new VlcEntry(VlcEntry.Fork, [57, 58]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 11,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 10,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [60, 61]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 9,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 14,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [63, 66]),
		new VlcEntry(VlcEntry.Fork, [64, 65]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 13,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 2,
			level: 2,
		})),
		new VlcEntry(VlcEntry.Fork, [67, 68]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 1,
			level: 3,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 0,
			level: 5,
		})),
		new VlcEntry(VlcEntry.Fork, [77, 70]),
		new VlcEntry(VlcEntry.Fork, [71, 74]),
		new VlcEntry(VlcEntry.Fork, [72, 73]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 15,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 14,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [75, 76]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 13,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 12,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [78, 85]),
		new VlcEntry(VlcEntry.Fork, [79, 82]),
		new VlcEntry(VlcEntry.Fork, [80, 81]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 16,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 15,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [83, 84]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 4,
			level: 2,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 3,
			level: 2,
		})),
		new VlcEntry(VlcEntry.Fork, [86, 89]),
		new VlcEntry(VlcEntry.Fork, [87, 88]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 0,
			level: 7,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 0,
			level: 6,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 16,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [124, 91]),
		new VlcEntry(VlcEntry.Fork, [92, 109]),
		new VlcEntry(VlcEntry.Fork, [93, 102]),
		new VlcEntry(VlcEntry.Fork, [94, 99]),
		new VlcEntry(VlcEntry.Fork, [95, 98]),
		new VlcEntry(VlcEntry.Fork, [96, 97]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 0,
			level: 9,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 0,
			level: 8,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 24,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [100, 101]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 23,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 22,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [103, 106]),
		new VlcEntry(VlcEntry.Fork, [104, 105]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 21,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 20,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [107, 108]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 19,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 18,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [110, 117]),
		new VlcEntry(VlcEntry.Fork, [111, 114]),
		new VlcEntry(VlcEntry.Fork, [112, 113]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 17,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 0,
			level: 2,
		})),
		new VlcEntry(VlcEntry.Fork, [115, 116]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 22,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 21,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [118, 121]),
		new VlcEntry(VlcEntry.Fork, [119, 120]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 20,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 19,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [122, 123]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 18,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 17,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [174, 125]),
		new VlcEntry(VlcEntry.Fork, [127, 126]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.EscapeToLong)),
		new VlcEntry(VlcEntry.Fork, [128, 143]),
		new VlcEntry(VlcEntry.Fork, [129, 136]),
		new VlcEntry(VlcEntry.Fork, [130, 133]),
		new VlcEntry(VlcEntry.Fork, [131, 132]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 0,
			level: 12,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 1,
			level: 5,
		})),
		new VlcEntry(VlcEntry.Fork, [134, 135]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 23,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 24,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [137, 140]),
		new VlcEntry(VlcEntry.Fork, [138, 139]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 29,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 30,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [141, 142]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 31,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 32,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [144, 159]),
		new VlcEntry(VlcEntry.Fork, [145, 152]),
		new VlcEntry(VlcEntry.Fork, [146, 149]),
		new VlcEntry(VlcEntry.Fork, [147, 148]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 1,
			level: 6,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 2,
			level: 4,
		})),
		new VlcEntry(VlcEntry.Fork, [150, 151]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 4,
			level: 3,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 5,
			level: 3,
		})),
		new VlcEntry(VlcEntry.Fork, [153, 156]),
		new VlcEntry(VlcEntry.Fork, [154, 155]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 6,
			level: 3,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 10,
			level: 2,
		})),
		new VlcEntry(VlcEntry.Fork, [157, 158]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 25,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 26,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [160, 167]),
		new VlcEntry(VlcEntry.Fork, [161, 164]),
		new VlcEntry(VlcEntry.Fork, [162, 163]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 33,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 34,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [165, 166]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 35,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 36,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [168, 171]),
		new VlcEntry(VlcEntry.Fork, [169, 170]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 37,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 38,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [172, 173]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 39,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 40,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [190, 175]),
		new VlcEntry(VlcEntry.Fork, [176, 183]),
		new VlcEntry(VlcEntry.Fork, [177, 180]),
		new VlcEntry(VlcEntry.Fork, [178, 179]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 9,
			level: 2,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 8,
			level: 2,
		})),
		new VlcEntry(VlcEntry.Fork, [181, 182]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 7,
			level: 2,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 6,
			level: 2,
		})),
		new VlcEntry(VlcEntry.Fork, [184, 187]),
		new VlcEntry(VlcEntry.Fork, [185, 186]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 5,
			level: 2,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 3,
			level: 3,
		})),
		new VlcEntry(VlcEntry.Fork, [188, 189]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 2,
			level: 3,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 1,
			level: 4,
		})),
		new VlcEntry(VlcEntry.Fork, [198, 191]),
		new VlcEntry(VlcEntry.Fork, [192, 195]),
		new VlcEntry(VlcEntry.Fork, [193, 194]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 28,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 27,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [196, 197]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 26,
			level: 1,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 25,
			level: 1,
		})),
		new VlcEntry(VlcEntry.Fork, [206, 199]),
		new VlcEntry(VlcEntry.Fork, [200, 203]),
		new VlcEntry(VlcEntry.Fork, [201, 202]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 1,
			level: 2,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: true,
			run: 0,
			level: 3,
		})),
		new VlcEntry(VlcEntry.Fork, [204, 205]),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 0,
			level: 11,
		})),
		new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {
			last: false,
			run: 0,
			level: 10,
		})),
		new VlcEntry(VlcEntry.End, null)
	]

	function decode_block(reader, decoder_options, picture, running_options, macroblock_type, tcoef_present) {
		return reader.withTransaction(function(reader) {
			let intradc = null;
			if (macroblock_type.is_intra()) {
				intradc = IntraDc.from_u8(reader.readUint8());
				if (intradc === null) 
					throw new Error("InvalidIntraDc");
			}
			var tcoef = [];
			while(tcoef_present) {
				let short_tcoef = reader.readVLC(TCOEF_TABLE);
				if (short_tcoef === null) 
					throw new Error("InvalidShortCoefficient");
				switch(short_tcoef.type) {
					case ShortTCoefficient.EscapeToLong:
						let level_width = null;
						if (decoder_options.sorensonSpark && (picture.version == 1)) {
							if (reader.readBits(1) == 1) {
								level_width = 11;
							} else {
								level_width = 7;
							}
						} else {
							level_width = 8;
						}
						let last = reader.readBits(1) == 1;
						let run = reader.readBits(6);
						let level = reader.readSignedBits(level_width);
						if (level == 0) {
							throw new Error("InvalidLongCoefficient");
						}
						tcoef.push(new TCoefficient(false, run, level));
						tcoef_present = !last;
						break;
					case ShortTCoefficient.Run:
						var res = short_tcoef.value;
						let sign = reader.readBits(1);
						if (sign == 0) {
							tcoef.push(new TCoefficient(true, res.run, res.level));
						} else {
							tcoef.push(new TCoefficient(true, res.run, -res.level));
						}
						tcoef_present = !res.last;
						break;
				}  
			}
			return new Block(intradc, tcoef);
		});
	}

	const num_signum = function(num) {
		if (num > 0) {
			return 1;
		} else if (num == 0) {
			return 0;
		} else {
			return -1;
		}
	}

	const DEZIGZAG_MAPPING = [[0, 0], [1, 0], [0, 1], [0, 2], [1, 1], [2, 0], [3, 0], [2, 1], [1, 2], [0, 3], [0, 4], [1, 3], [2, 2], [3, 1], [4, 0], [5, 0], [4, 1], [3, 2], [2, 3], [1, 4], [0, 5], [0, 6], [1, 5], [2, 4], [3, 3], [4, 2], [5, 1], [6, 0], [7, 0], [6, 1], [5, 2], [4, 3], [3, 4], [2, 5], [1, 6], [0, 7], [1, 7], [2, 6], [3, 5], [4, 4], [5, 3], [6, 2], [7, 1], [7, 2], [6, 3], [5, 4], [4, 5], [3, 6], [2, 7], [3, 7], [4, 6], [5, 5], [6, 4], [7, 3], [7, 4], [6, 5], [5, 6], [4, 7], [5, 7], [6, 6], [7, 5], [7, 6], [6, 7], [7, 7]]

	function inverse_rle(encoded_block, levels, pos, blk_per_line, quant) {
		let block_id = asI32(pos[0] / 8) + (asI32(pos[1] / 8) * blk_per_line);
		if (encoded_block.tcoef.length == 0) {
			if (encoded_block.intradc) {
				let dc_level = encoded_block.intradc.into_level();
				if (dc_level == 0) {
					levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Zero);
				} else {
					levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Dc, dc_level);
				}
			} else {
				levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Zero);
			}
		} else {
			var block_data = [new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8)];
			let is_horiz = true;
			let is_vert = true;
			let zigzag_index = 0;
			if (encoded_block.intradc) {
				block_data[0][0] = encoded_block.intradc.into_level();
				zigzag_index += 1;
			}
			for (var i = 0; i < encoded_block.tcoef.length; i++) {
				var tcoef = encoded_block.tcoef[i];
				zigzag_index += tcoef.run;
				if (zigzag_index >= DEZIGZAG_MAPPING.length) {
					return; // TODO
				}
				let [zig_x, zig_y] = DEZIGZAG_MAPPING[zigzag_index];
				let dequantized_level = asI16(quant) * ((2 * Math.abs(tcoef.level)) + 1);
				let parity = null;
				if (quant % 2 == 1) {
					parity = 0;
				} else {
					parity = -1;
				}
				let val = Math.max(Math.min(num_signum(tcoef.level) * (dequantized_level + parity), 2047), -2048);
				block_data[zig_y][zig_x] = val;
				zigzag_index += 1;
				if (val != 0.0) {
					if (zig_y > 0) {
						is_horiz = false;
					}
					if (zig_x > 0) {
						is_vert = false;
					}
				}
			}
			if ((is_horiz == true) && (is_vert == true)) {
				if (block_data[0][0] == 0) {
					levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Zero);
				} else {
					levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Dc, block_data[0][0]);
				}
			} else if ((is_horiz == true) && (is_vert == false)) {
				levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Horiz, block_data[0]);
			} else if ((is_horiz == false) && (is_vert == true)) {
				var r = new Float32Array(8);
				r[0] = block_data[0][0];
				r[1] = block_data[1][0];
				r[2] = block_data[2][0];
				r[3] = block_data[3][0];
				r[4] = block_data[4][0];
				r[5] = block_data[5][0];
				r[6] = block_data[6][0];
				r[7] = block_data[7][0];
				levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Vert, r);
			} else if ((is_horiz == false) && (is_vert == false)) {
				levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Full, block_data);
			}
		}
	}

	function decode_gob(reader, _decoder_options) {
		// with_transaction_union
		return reader.withTransactionUnion(function(reader) {
			let skipped_bits = reader.recognizeStartCode(false);
			if (skipped_bits === null) {
				throw new Error("InvalidGobHeader");
			}
			reader.skipBits(17 + skipped_bits);
			let gob_id = reader.readBits(5);
			if (gob_id == 0 || gob_id == 15) {
				return null;
			}
			throw new Error("UnimplementedDecoding");
		});
	}

	function read_sample(pixel_array, samples_per_row, num_rows, pos) {
		let [x, y] = pos;
		let _x = num_clamp(x, 0, samples_per_row - 1);
		let _y = num_clamp(y, 0, num_rows - 1);
		return pixel_array[_x + (_y * samples_per_row)];
	}
	function lerp(sample_a, sample_b, middle) {
		if (middle) {
			return asU8((sample_a + sample_b + 1) / 2);
		} else {
			return asU8(sample_a);
		}
	}

	function asfgdgdfg(value, min, max) {
		return (value >= min) && (value <= max);
	}

	function gather_block(pixel_array, samples_per_row, pos, mv, target) {
		var g = mv.into_lerp_parameters();
		let [x_delta, x_interp] = g[0];
		let [y_delta, y_interp] = g[1];
		let src_x = asI32(pos[0] + x_delta);
		let src_y = asI32(pos[1] + y_delta);
		let array_height = asI32(pixel_array.length / samples_per_row);
		let block_cols = num_clamp((samples_per_row - pos[0]), 0, 8);
		let block_rows = num_clamp((array_height - pos[1]), 0, 8);
		if (!x_interp && !y_interp) {
			if (block_cols == 8 && block_rows == 8 && asfgdgdfg(src_x, 0, samples_per_row - 8) && asfgdgdfg(src_y, 0, array_height - 8)) {
				for (var j = 0; j < 8; j++) {
					let src_offset = src_x + ((src_y + j) * samples_per_row);
					let dest_offset = pos[0] + (pos[1] + j) * samples_per_row;
					for (var _ = 0; _ < 8; _++) {
						target[dest_offset + _] = pixel_array[src_offset + _];
					}
				}
			} else {
				for (var _j = 0; _j < block_rows; _j += 1) {
					var j = _j;
					var v = _j + src_y;
					for (var _i = 0; _i < block_cols; _i += 1) {
						var i = _i;
						var u = _i + src_x;
						target[pos[0] + i + ((pos[1] + j) * samples_per_row)] = read_sample(pixel_array, samples_per_row, array_height, [u, v]);
					}
				}
			}
		} else {
			for (var _j = 0; _j < block_rows; _j += 1) {
				var j = _j;
				var v = _j + src_y;
				for (var _i = 0; _i < block_cols; _i += 1) {
					var i = _i;
					var u = _i + src_x;
					let sample_0_0 = read_sample(pixel_array, samples_per_row, array_height, [u, v]);
					let sample_1_0 = read_sample(pixel_array, samples_per_row, array_height, [u + 1, v]);
					let sample_0_1 = read_sample(pixel_array, samples_per_row, array_height, [u, v + 1]);
					let sample_1_1 = read_sample(pixel_array, samples_per_row, array_height, [u + 1, v + 1]);
					if (x_interp && y_interp) {
						let sample = asU8((sample_0_0 + sample_1_0 + sample_0_1 + sample_1_1 + 2) / 4);
						target[pos[0] + i + ((pos[1] + j) * samples_per_row)] = sample;
					} else {
						let sample_mid_0 = lerp(sample_0_0, sample_1_0, x_interp);
						let sample_mid_1 = lerp(sample_0_1, sample_1_1, x_interp);
						target[pos[0] + i + ((pos[1] + j) * samples_per_row)] = lerp(sample_mid_0, sample_mid_1, y_interp);
					}
				}
			}
		}
	}

	function gather(mb_types, reference_picture, mvs, mb_per_line, new_picture) {
		for (var i = 0; i < mb_types.length; i++) { // TODO mb_types.iter().zip(mvs.iter()).enumerate()
			var mb_type = mb_types[i];
			var mv = mvs[i];
			if (mb_type.is_inter()) {
				if (!reference_picture)
					throw new Error("UncodedIFrameBlocks");
				let luma_samples_per_row = reference_picture.luma_samples_per_row();
				let pos = [
					Math.floor(i % mb_per_line) * 16,
					Math.floor(i / mb_per_line) * 16
				];
				gather_block(reference_picture.as_luma(), luma_samples_per_row, pos, mv[0], new_picture.as_luma_mut());
				gather_block(reference_picture.as_luma(), luma_samples_per_row, [pos[0] + 8, pos[1]], mv[1], new_picture.as_luma_mut());
				gather_block(reference_picture.as_luma(), luma_samples_per_row, [pos[0], pos[1] + 8], mv[2], new_picture.as_luma_mut());
				gather_block(reference_picture.as_luma(), luma_samples_per_row, [pos[0] + 8, pos[1] + 8], mv[3], new_picture.as_luma_mut());
				let mv_chr = mv[0].add(mv[1].add(mv[2].add(mv[3]))).average_sum_of_mvs();
				let chroma_samples_per_row = reference_picture.chroma_samples_per_row;
				let chroma_pos = [Math.floor(i % mb_per_line) * 8, Math.floor(i / mb_per_line) * 8];
				gather_block(reference_picture.as_chroma_b(), chroma_samples_per_row, [chroma_pos[0], chroma_pos[1]], mv_chr, new_picture.as_chroma_b_mut());
				gather_block(reference_picture.as_chroma_r(), chroma_samples_per_row, [chroma_pos[0], chroma_pos[1]], mv_chr, new_picture.as_chroma_r_mut());
			}
		}
	}
	function num_clamp(value, a, b) {
		return Math.max(Math.min(value, b), a);
	}
	const BASIS_TABLE = [
		new Float32Array([0.70710677, 0.70710677, 0.70710677, 0.70710677, 0.70710677, 0.70710677, 0.70710677, 0.70710677]),
		new Float32Array([0.98078525, 0.8314696, 0.5555702, 0.19509023, -0.19509032, -0.55557036, -0.83146966, -0.9807853]),
		new Float32Array([0.9238795, 0.38268343, -0.38268352, -0.9238796, -0.9238795, -0.38268313, 0.3826836, 0.92387956]),
		new Float32Array([0.8314696, -0.19509032, -0.9807853, -0.55557, 0.55557007, 0.98078525, 0.19509007, -0.8314698]),
		new Float32Array([0.70710677, -0.70710677, -0.70710665, 0.707107, 0.70710677, -0.70710725, -0.70710653,  0.7071068]),
		new Float32Array([0.5555702, -0.9807853, 0.19509041, 0.83146936, -0.8314698, -0.19508928, 0.9807853, -0.55557007]),
		new Float32Array([0.38268343, -0.9238795, 0.92387974, -0.3826839, -0.38268384, 0.9238793, -0.92387974,  0.3826839]),
		new Float32Array([0.19509023, -0.55557, 0.83146936, -0.9807852, 0.98078525, -0.83147013, 0.55557114, -0.19508967])
	];
	function idct_1d(input, output) {
		output.fill(0);
		for (var i = 0; i < output.length; i++) {
			for (var freq = 0; freq < 8; freq++) {
				output[i] += input[freq] * BASIS_TABLE[freq][i];
			}
		}
	}
	function idct_channel(block_levels, output, blk_per_line, output_samples_per_line) {
		let output_height = asI32(output.length / output_samples_per_line);
		let blk_height = asI32(block_levels.length / blk_per_line);
		let idct_intermediate = [new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8)];
		let idct_output = [new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8)];
		for (var y_base = 0; y_base < blk_height; y_base++) {
			for (var x_base = 0; x_base < blk_per_line; x_base++) {
				let block_id = x_base + (y_base * blk_per_line);
				if (block_id >= block_levels.length) 
					continue;
				let xs = num_clamp((output_samples_per_line - x_base * 8), 0, 8);
				let ys = num_clamp((output_height - y_base * 8), 0, 8);
				var b = block_levels[block_id];
				switch(b.type) {
					case DecodedDctBlock.Zero:
						break;
					case DecodedDctBlock.Dc:
						var dc = b.value;
						let clipped_idct = num_clamp(asI16((dc * 0.5 / 4.0 + num_signum(dc) * 0.5)), -256, 255);
						for (var y_offset = 0; y_offset < ys; y_offset++) {
							for (var x_offset = 0; x_offset < xs; x_offset++) {
								let x = x_base * 8 + x_offset;
								let y = y_base * 8 + y_offset;
								let mocomp_pixel = asI16(output[x + (y * output_samples_per_line)]);
								output[x + (y * output_samples_per_line)] = asU8(num_clamp(clipped_idct + mocomp_pixel, 0, 255));
							}
						}
						break;
					case DecodedDctBlock.Horiz:
						var first_row = b.value;
						idct_1d(first_row, idct_intermediate[0]);
						for (var y_offset = 0; y_offset < ys; y_offset++) {
							var _idcts = idct_intermediate[0];
							for (var x_offset = 0; x_offset < xs; x_offset++) {
								var idct = _idcts[x_offset];
								let x = x_base * 8 + x_offset;
								let y = y_base * 8 + y_offset;
								let clipped_idct = num_clamp((asI16(idct * BASIS_TABLE[0][0] / 4.0 + num_signum(idct) * 0.5)), -256, 255);
								let mocomp_pixel = asI16(output[x + (y * output_samples_per_line)]);
								output[x + (y * output_samples_per_line)] = asU8(num_clamp((clipped_idct + mocomp_pixel), 0, 255));
							}
						}
						break;
					case DecodedDctBlock.Vert:
						var first_col = b.value;
						idct_1d(first_col, idct_intermediate[0]);
						var _idcts = idct_intermediate[0];
						for (var y_offset = 0; y_offset < ys; y_offset++) {
							var idct = _idcts[y_offset];
							for (var x_offset = 0; x_offset < xs; x_offset++) {
								let x = x_base * 8 + x_offset;
								let y = y_base * 8 + y_offset;
								let clipped_idct = num_clamp((asI16(idct * BASIS_TABLE[0][0] / 4.0 + num_signum(idct) * 0.5)), -256, 255);
								let mocomp_pixel = asI16(output[x + (y * output_samples_per_line)]);
								output[x + (y * output_samples_per_line)] = asU8(num_clamp((clipped_idct + mocomp_pixel), 0, 255));
							}
						}
						break;
					case DecodedDctBlock.Full:
						var block_data = b.value;
						for (var row = 0; row < 8; row++) {
							idct_1d(block_data[row], idct_output[row]);
							for (var i = 0; i < idct_intermediate.length; i++) {
								idct_intermediate[i][row] = idct_output[row][i];
							}
						}
						for (var row = 0; row < 8; row++) {
							idct_1d(idct_intermediate[row], idct_output[row]);
						}
						for (var x_offset = 0; x_offset < xs; x_offset++) {
							var idct_row = idct_output[x_offset];
							for (var y_offset = 0; y_offset < ys; y_offset++) {
								var idct = idct_row[y_offset];
								let x = x_base * 8 + x_offset;
								let y = y_base * 8 + y_offset;
								let clipped_idct = num_clamp((asI16(idct / 4.0 + num_signum(idct) * 0.5)), -256, 255);
								let mocomp_pixel = asI16(output[x + (y * output_samples_per_line)]);
								output[x + (y * output_samples_per_line)] = asU8(num_clamp((clipped_idct + mocomp_pixel), 0, 255));
							}
						}
						break;
				}
			}
		}
	}

	function predict_candidate(predictor_vectors, current_predictors, mb_per_line, index) {
		let current_mb = predictor_vectors.length;
		let col_index = current_mb % mb_per_line;
		let mv1_pred = null;

		switch(index) {
			case 0:
			case 2:
				if (col_index == 0) {
					mv1_pred = MotionVector.zero();
				} else {
					mv1_pred = predictor_vectors[current_mb - 1][index + 1];
				}
				break;
			case 1:
			case 3:
				mv1_pred = current_predictors[index - 1];
				break;
			default:
				throw new Error("unreachable");
		}

		/*
		let mv1_pred = match index {
				0 | 2 if col_index == 0 => MotionVector::zero(),
				0 | 2 => predictor_vectors[current_mb - 1][index + 1],
				1 | 3 => current_predictors[index - 1],
				_ => unreachable!(),
		};
		*/

		let line_index = asI32(current_mb / mb_per_line);
		let last_line_mb = (saturatingSub(line_index, 1) * mb_per_line) + col_index;
		let mv2_pred = null;
		switch(index) {
			case 0:
			case 1:
				if (line_index == 0) {
					mv2_pred = mv1_pred;
				} else {
					var r = predictor_vectors[last_line_mb];
					if (r) {
						mv2_pred = r[index + 2];
					} else {
						mv2_pred = mv1_pred;
					}
				}
				break;
			case 2:
			case 3:
				mv2_pred = current_predictors[0];
				break;
			default:
				throw new Error("unreachable");
		}
		let is_end_of_line = col_index == saturatingSub(mb_per_line, 1);
		let mv3_pred = null;
		switch(index) {
			case 0:
			case 1:
				if (is_end_of_line) {
					mv3_pred = MotionVector.zero();
				} else {
					if (line_index == 0) {
						mv3_pred = mv1_pred;
					} else {
						var r = predictor_vectors[last_line_mb + 1];
						if (r) {
							mv3_pred = r[2];
						} else {
							mv3_pred = mv1_pred;
						}
					}
				}
				break;
			case 2:
			case 3:
				mv3_pred = current_predictors[1];
				break;
			default:
				throw new Error("unreachable");
		}
		return mv1_pred.median_of(mv2_pred, mv3_pred);
	}

	function halfpel_decode(current_picture, running_options, predictor, mvd, is_x) {
		let range = HalfPel.STANDARD_RANGE;
		let out = new HalfPel(asI16(mvd.n + predictor.n));
		if (running_options.UNRESTRICTED_MOTION_VECTORS && !current_picture.as_header().has_plusptype) {
			if (predictor.is_mv_within_range(HalfPel.STANDARD_RANGE)) {
				return out;
			} else {
				range = HalfPel.EXTENDED_RANGE;
			}
		} else {
			var rrh = current_picture.as_header().motion_vector_range;
			if (rrh) rrh = rrh.type == MotionVectorRange.Extended;
			if (running_options.UNRESTRICTED_MOTION_VECTORS && rrh) {
				console.log(current_picture.format);
			}
		}
		if (!out.is_mv_within_range(range)) {
			out = new HalfPel(asI16(mvd.invert().n + predictor.n));
		}
		return out;
	}

	function mv_decode(current_picture, running_options, predictor, mvd) {
		let mvx = mvd.n1;
		let mvy = mvd.n2;
		let cpx = predictor.n1;
		let cpy = predictor.n2;
		let out_x = halfpel_decode(current_picture, running_options, cpx, mvx, true);
		let out_y = halfpel_decode(current_picture, running_options, cpy, mvy, false);
		return new MotionVector(out_x, out_y);
	}

	const H263State = function(decoderOptions) {
		this.decoderOptions = decoderOptions;
		this.last_picture = null;
		this.reference_picture = null;
		this.running_options = PictureOption.empty();
		this.reference_states = new Map();
	}
	H263State.prototype.isSorenson = function() {
		return this.decoderOptions.sorensonSpark;
	}
	H263State.prototype.getLastPicture = function() {
		if (this.last_picture === null) { // self.last_picture.is_none()
			return null;
		} else {
			return this.reference_states.get(this.last_picture);
		}
	}
	H263State.prototype.getReferencePicture = function() {
		if (this.reference_picture === null) {
			return null;
		} else {
			return this.reference_states.get(this.reference_picture);
		}
	}
	function map_remove_entry(_, fg) {
		return _.get(fg);
	}
	H263State.prototype.cleanup_buffers = function() {
		var r1 = this.last_picture;
		let last_picture = map_remove_entry(this.reference_states, r1);
		let r2 = this.reference_picture;
		let reference_picture = map_remove_entry(this.reference_states, r2);
		this.reference_states = new Map();
		if (last_picture) {
			this.reference_states.set(r1, last_picture);
		}
		if (reference_picture) {
			//this.reference_states.set(r2, reference_picture);
		}
	}
	H263State.prototype.parsePicture = function(reader, previous_picture) {
		return decodePicture(reader, this.decoderOptions, previous_picture);
	}
	H263State.prototype.decodeNextPicture = function(reader) {
		// with_transaction
		let next_picture = this.parsePicture(reader, this.getLastPicture());
		var next_running_options = null;
		if (next_picture.has_plusptype && next_picture.has_opptype) {
			console.log("has_plusptype has_opptype");
			next_running_options = next_picture.options;
		} else if (next_picture.has_plusptype) {
			console.log("has_plusptype");
			// (next_picture.options & !*OPPTYPE_OPTIONS) | (self.running_options & *OPPTYPE_OPTIONS)
		} else {
			next_running_options = next_picture.options;
		}
		let format = null;
		if (next_picture.format) {
			format = next_picture.format;
		} else if (next_picture.picture_type.type == PictureTypeCode.IFrame) {
			throw new Error("PictureFormatMissing");
		} else {
			var ref_format = null;
			var rfgh = this.getLastPicture();
			if (rfgh !== null) {
				ref_format = rfgh.format;
			} else {
				throw new Error("PictureFormatMissing");
			}
			format = ref_format;
		}

		let reference_picture = this.getReferencePicture();
		let output_dimensions = format.intoWidthAndHeight();
		let mb_per_line = Math.ceil(output_dimensions[0] / 16.0);
		let mb_height = Math.ceil(output_dimensions[1] / 16.0);
		let level_dimensions = [mb_per_line * 16, mb_height * 16];
		let in_force_quantizer = next_picture.quantizer;
		var MAX_L = mb_per_line * mb_height;
		let predictor_vectors = []; // all previously decoded MVDs
		let macroblock_types = [];
		let next_decoded_picture = new DecodedPicture(next_picture, format);
		var luma_levels = new Array(level_dimensions[0] * level_dimensions[1] / 64);
		var chroma_b_levels = new Array(level_dimensions[0] * level_dimensions[1] / 4 / 64);
		var chroma_r_levels = new Array(level_dimensions[0] * level_dimensions[1] / 4 / 64);
		for (var i = 0; i < luma_levels.length; i++) 
			luma_levels[i] = new DecodedDctBlock(DecodedDctBlock.Zero);
		for (var i = 0; i < chroma_b_levels.length; i++) 
			chroma_b_levels[i] = new DecodedDctBlock(DecodedDctBlock.Zero);
		for (var i = 0; i < chroma_r_levels.length; i++) 
			chroma_r_levels[i] = new DecodedDctBlock(DecodedDctBlock.Zero);
		while((reader.bitAva() > 0) && (macroblock_types.length < MAX_L)) { // TODO
			let mb;
			try {
				mb = decode_macroblock(reader, next_decoded_picture.as_header(), next_running_options);
			} catch(e) {
				mb = e.message;
			}
			let pos = [
				Math.floor(macroblock_types.length % mb_per_line) * 16,
				Math.floor(macroblock_types.length / mb_per_line) * 16
			];
			let motion_vectors = [];
			for (var i = 0; i < 4; i++) 
				motion_vectors.push(MotionVector.zero());
			var mb_type = null;
			var isStuffing = false;
			if (typeof mb == "string") {
				if (is_eof_error(mb)) {
					break;
				} else {
					throw new Error(mb);
				}
			} else {
				switch(mb.type) {
					case Macroblock.Stuffing:
						isStuffing = true;
						break;
					case Macroblock.Uncoded: 
						if (next_decoded_picture.as_header().picture_type.type == PictureTypeCode.IFrame) {
							throw new Error("UncodedIFrameBlocks");
						}
						mb_type = new MacroblockType(MacroblockType.Inter);
						break;
					case Macroblock.Coded: 
						var res = mb.value;
						let quantizer = asI8(asI8(in_force_quantizer) + ((res.d_quantizer === null) ? 0 : res.d_quantizer));
						in_force_quantizer = asU8(num_clamp(quantizer, 1, 31));
						if (res.mb_type.is_inter()) {
							let mv1 = res.motion_vector;
							if (mv1 === null) 
								mv1 = MotionVector.zero();
							let mpred1 = predict_candidate(predictor_vectors, motion_vectors, mb_per_line, 0);
							motion_vectors[0] = mv_decode(next_decoded_picture, next_running_options, mpred1, mv1);
							var addl_motion_vectors = res.addl_motion_vectors;
							if (addl_motion_vectors) {
								let mpred2 = predict_candidate(predictor_vectors, motion_vectors, mb_per_line, 1);
								motion_vectors[1] = mv_decode(next_decoded_picture, next_running_options, mpred2, addl_motion_vectors[0]);

								let mpred3 = predict_candidate(predictor_vectors, motion_vectors, mb_per_line, 2);
								motion_vectors[2] = mv_decode(next_decoded_picture, next_running_options, mpred3, addl_motion_vectors[1]);

								let mpred4 = predict_candidate(predictor_vectors, motion_vectors, mb_per_line, 3);
								motion_vectors[3] = mv_decode(next_decoded_picture, next_running_options, mpred4, addl_motion_vectors[2]);
							} else {
								motion_vectors[1] = motion_vectors[0];
								motion_vectors[2] = motion_vectors[0];
								motion_vectors[3] = motion_vectors[0];
							};
						}

						let luma0 = decode_block(reader, this.decoderOptions, next_decoded_picture.as_header(), next_running_options, res.mb_type, res.coded_block_pattern.codes_luma[0]);
						inverse_rle(luma0, luma_levels, pos, level_dimensions[0] / 8, in_force_quantizer);
						
						let luma1 = decode_block(reader, this.decoderOptions, next_decoded_picture.as_header(), next_running_options, res.mb_type, res.coded_block_pattern.codes_luma[1]);
						inverse_rle(luma1, luma_levels, [pos[0] + 8, pos[1]], level_dimensions[0] / 8, in_force_quantizer);
					 
						let luma2 = decode_block(reader, this.decoderOptions, next_decoded_picture.as_header(), next_running_options, res.mb_type, res.coded_block_pattern.codes_luma[2]);
						inverse_rle(luma2, luma_levels, [pos[0], pos[1] + 8], level_dimensions[0] / 8, in_force_quantizer);
						
						let luma3 = decode_block(reader, this.decoderOptions, next_decoded_picture.as_header(), next_running_options, res.mb_type, res.coded_block_pattern.codes_luma[3]);
						inverse_rle(luma3, luma_levels, [pos[0] + 8, pos[1] + 8], level_dimensions[0] / 8, in_force_quantizer);

						let chroma_b = decode_block(reader, this.decoderOptions, next_decoded_picture.as_header(), next_running_options, res.mb_type, res.coded_block_pattern.codes_chroma_b);
						inverse_rle(chroma_b, chroma_b_levels, [pos[0] / 2, pos[1] / 2], mb_per_line, in_force_quantizer);

						let chroma_r = decode_block(reader, this.decoderOptions, next_decoded_picture.as_header(), next_running_options, res.mb_type, res.coded_block_pattern.codes_chroma_r);
						inverse_rle(chroma_r, chroma_r_levels, [pos[0] / 2, pos[1] / 2], mb_per_line, in_force_quantizer);
						
						mb_type = res.mb_type;
						break;
				}
				if (isStuffing) continue;
			}
			predictor_vectors.push(motion_vectors);
			macroblock_types.push(mb_type);  
		}
		while (predictor_vectors.length < MAX_L) predictor_vectors.push(MotionVector.zero());
		while (macroblock_types.length < MAX_L) macroblock_types.push(new MacroblockType(MacroblockType.Inter));
		gather(macroblock_types, reference_picture, predictor_vectors, mb_per_line, next_decoded_picture);
		idct_channel(luma_levels, next_decoded_picture.as_luma_mut(), mb_per_line * 2, (output_dimensions[0]));
		let chroma_samples_per_row = next_decoded_picture.chroma_samples_per_row;
		idct_channel(chroma_b_levels, next_decoded_picture.as_chroma_b_mut(), mb_per_line, chroma_samples_per_row);
		idct_channel(chroma_r_levels, next_decoded_picture.as_chroma_r_mut(), mb_per_line, chroma_samples_per_row);
		if (next_decoded_picture.as_header().picture_type.type == PictureTypeCode.IFrame) {
			this.reference_picture = null;
		}
		let this_tr = next_decoded_picture.as_header().temporal_reference;
		this.last_picture = this_tr;
		if (!next_decoded_picture.as_header().picture_type.is_disposable()) {
			this.reference_picture = this_tr;
		}
		this.reference_states.set(this_tr, next_decoded_picture);
		this.cleanup_buffers();
	}

	const H263Reader = function(source) {
		this.source = source;
		this.bitsRead = 0;
	}
	H263Reader.prototype.readBits = function(bitsNeeded) {
		let r = this.peekBits(bitsNeeded);
		this.skipBits(bitsNeeded);
		return r;
	};
	H263Reader.prototype.readSignedBits = function(bitsNeeded) {
		let uval = this.readBits(bitsNeeded);
		var shift = 32 - bitsNeeded;
		return (uval << shift) >> shift;
	};
	H263Reader.prototype.peekBits = function(bitsNeeded) {
		if (bitsNeeded == 0) {
			return 0; // T::zero
		}
		let accum = 0; // T::zero
		var i = bitsNeeded;
		let last_bits_read = this.bitsRead;
		while (i--) {
			if (bitsNeeded == 0) 
				break;
			let bytes_read = Math.floor(this.bitsRead / 8);
			let bits_read = (this.bitsRead % 8);
			if (bytes_read >= this.source.length) {
				throw new Error("EndOfFile");
			}
			let byte = this.source[bytes_read];
			accum <<= 1;
			accum |= ((byte >> (7 - bits_read)) & 0x1);
			this.bitsRead++;
		}

		this.bitsRead = last_bits_read;

		return accum;
	}
	H263Reader.prototype.skipBits = function(bits_to_skip) {
		this.bitsRead += bits_to_skip;
	}
	H263Reader.prototype.readUint8 = function() {
		return this.readBits(8);
	}
	H263Reader.prototype.recognizeStartCode = function(in_error) {
		return this.withLookahead(function(reader) {
			let max_skip_bits = reader.realignmentBits();
			let skip_bits = 0;
			let maybe_code = reader.peekBits(17);
			while (maybe_code != 1) {
				if (!in_error && skip_bits > max_skip_bits) {
					return null;
				}
				reader.skipBits(1);
				skip_bits += 1;
				maybe_code = reader.peekBits(17);
			}
			return skip_bits;
		})
	}
	H263Reader.prototype.realignmentBits = function() {
		return (8 - (this.bitsRead % 8)) % 8;
	}
	H263Reader.prototype.checkpoint = function() {
		return this.bitsRead;
	}
	H263Reader.prototype.readVLC = function(table) {
		var index = 0;
		while(true) {
			var res = table[index];
			if (res) {
				switch(res.type) {
					case VlcEntry.End:
						return res.value; // clone
					case VlcEntry.Fork:
						let next_bit = this.readBits(1);
						if (next_bit == 0) {
							index = res.value[0];
						} else {
							index = res.value[1];
						}
						break;
				}
			} else {
				throw new Error("InternalDecoderError");
			}
		}
	}
	H263Reader.prototype.read_umv = function() {
		let start = this.readBits(1);
		if (start == 1) 
			return HalfPel.from_unit(0);
		let mantissa = 0;
		let bulk = 1; 
		while (bulk < 4096) {
			var r = this.readBits(2);
			switch(r) {
				case 0b00: 
					return HalfPel.from_unit(mantissa + bulk);
				case 0b10: 
					return HalfPel.from_unit(-(mantissa + bulk));
				case 0b01: 
					mantissa <<= 1;
					bulk <<= 1;
					break;
				case 0b11: 
					mantissa = mantissa << 1 | 1;
					bulk <<= 1;
					break;
			}
		}
		throw new Error("InvalidMvd");
	}
	H263Reader.prototype.bitAva = function() {
		return (this.source.length * 8) - this.bitsRead;
	}
	H263Reader.prototype.rollback = function(checkpoint) {
		if (checkpoint > (this.source.length * 8)) {
			throw new Error("InternalDecoderError");
		}
		this.bitsRead = checkpoint;
	}
	H263Reader.prototype.withTransaction = function(f) {
		var checkpoint = this.checkpoint();
		let result;
		try {
			result = f(this);
		} catch(e) {
			this.rollback(checkpoint);
			throw e;
		}
		return result;
	}
	H263Reader.prototype.withTransactionUnion = function(f) {
		var checkpoint = this.checkpoint();
		let result;
		try {
			result = f(this);
			if (result === null) this.rollback(checkpoint);
		} catch(e) {
			this.rollback(checkpoint);
			throw e;
		}
		return result;
	}
	H263Reader.prototype.withLookahead = function(f) {
		var checkpoint = this.checkpoint();
		let result = f(this);
		this.rollback(checkpoint);
		return result;
	}
	return {
		H263Reader,
		H263State
	}
}());

/*
 * at-nihav-vp6-decoder.js
 * 
 * The VP6 Decoder
 * 
 * credit at source: https://github.com/ruffle-rs/nihav-vp6
 * 
 * create on 3 de octubre de 2024, 20:25:40
 *
 * (c) 2024 ATFSMedia Studio.
 */

var AT_NIHAV_VP6_Decoder = (function() {
	function validate(isH) {
		if (!isH) throw new Error("ValidationError");
	}
	const asU8 = function(num) {
		return (num << 24) >>> 24;
	}
	const asU32 = function(num) {
		return num >>> 0;
	}
	const asI32 = function(num) {
		return num | 0;
	}
	const asI16 = function(num) {
		return (num << 16) >> 16;
	}
	const asU16 = function(num) {
		return (num << 16) >>> 16;
	}
	const asI8 = function(num) {
		return (num << 24) >> 24;
	}
	const wrapping_mul_i16 = function(a, b) {
		return asI16(a * b);
	}
	const Bits = function(src) {
		this.src = src;
		this.bytePos = 0;
		this.bitPos = 0;
	}
	Bits.prototype.read = function(n) {
		var value = 0;
		while (n--) (value <<= 1), (value |= this.readBit());
		return value;
	}
	Bits.prototype.readBit = function() {
		var val = (this.src[this.bytePos] >> (7 - this.bitPos++)) & 0x1;
		if (this.bitPos > 7) {
			this.bytePos++;
			this.bitPos = 0;
		}
		return val;
	}
	Bits.prototype.read_bool = function() {
		return !!this.readBit();
	}
	Bits.prototype.tell = function() {
		return (this.bytePos * 8) + this.bitPos;
	}
	function edge_emu(src, xpos, ypos, bw, bh, dst, dstride, comp, align) {
		let stride = src.get_stride(comp);
		let offs   = src.get_offset(comp);
		let [w_, h_] = src.get_dimensions(comp);
		let [hss, vss] = src.get_info().get_format().get_chromaton(comp).get_subsampling();
		let data = src.get_data();
		let framebuf = data;
		let w, h;
		if (align == 0) {
			w = w_;
			h = h_;
		} else {
			let wa = (align > hss) ? (1 << (align - hss)) - 1 : 0;
			let ha = (align > vss) ? (1 << (align - vss)) - 1 : 0;
			w = (w_ + wa) - wa;
			h = (h_ + ha) - ha;
		}
		for (let y = 0; y < bh; y++) {
			let srcy;
			if (y + ypos < 0) {
				srcy = 0;
			} else if ((y) + ypos >= (h)) {
				srcy = h - 1;
			} else {
				srcy = ((y) + ypos);
			}
			for (let x = 0; x < bw; x++) {
				let srcx;
				if ((x) + xpos < 0) {
					srcx = 0;
				} else if ((x) + xpos >= (w)) {
					srcx = w - 1;
				} else {
					srcx = ((x) + xpos);
				}
				dst[x + y * dstride] = framebuf[offs + srcx + srcy * stride];
			}
		}
	}

	const MV = function(x, y) {
		this.x = asI16(x);
		this.y = asI16(y);
	}
	MV.prototype.add = function(other) {
		return new MV(this.x + other.x, this.y + other.y);
	}
	MV.prototype.eq = function(other) {
		return (this.x == other.x) && (this.y == other.y);
	}
	const ZERO_MV = new MV(0, 0);

	const ZIGZAG = new Uint32Array([0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]);

	//// formats ////

	const MAX_CHROMATONS = 5;

	const YUVSubmodel = function(type) {
		this.type = type;
	}
	YUVSubmodel.YCbCr = 1;
	YUVSubmodel.YIQ = 2;
	YUVSubmodel.YUVJ = 3;

	const ColorModel = function(type, value) {
		this.type = type;
		this.value = value;
	}
	ColorModel.RGB = 1; // RGBSubmodel
	ColorModel.YUV = 2; // YUVSubmodel
	ColorModel.CMYK = 3;
	ColorModel.HSV = 4;
	ColorModel.LAB = 5;
	ColorModel.XYZ = 6;

	const NAPixelChromaton = function(data) {
		this.h_ss = data.h_ss;
		this.v_ss = data.v_ss;
		this.packed = data.packed;
		this.depth = data.depth;
		this.shift = data.shift;
		this.comp_offs = data.comp_offs;
		this.next_elem = data.next_elem;
	}
	NAPixelChromaton.prototype.get_subsampling = function() {
		return [this.h_ss, this.v_ss]; // self.h_ss, self.v_ss
	}
	NAPixelChromaton.prototype.is_packed = function() {
		return this.packed;
	}
	NAPixelChromaton.prototype.get_depth = function() {
		return this.depth;
	}
	NAPixelChromaton.prototype.get_shift = function() {
		return this.shift;
	}
	NAPixelChromaton.prototype.get_offset = function() {
		return this.comp_offs;
	}
	NAPixelChromaton.prototype.get_step = function() {
		return this.next_elem;
	}
	NAPixelChromaton.prototype.get_width = function(width) {
		return (width + ((1 << this.h_ss) - 1)) >> this.h_ss;
	}
	NAPixelChromaton.prototype.get_height = function(height) {
		return (height + ((1 << this.v_ss) - 1)) >> this.v_ss;
	}
	NAPixelChromaton.prototype.get_linesize = function(width) {
		let d = this.depth;
		if (this.packed) {
			return (this.get_width(width) * d + d - 1) >> 3;
		} else {
			return this.get_width(width);
		}
	}
	NAPixelChromaton.prototype.get_data_size = function() {
		let nh = (height + ((1 << this.v_ss) - 1)) >> this.v_ss;
		return (this.get_linesize(width) * nh);
	}

	const NAPixelFormaton = function(data) {
		this.model = data.model; // ColorModel
		this.components = data.components; // u8
		this.comp_info = data.comp_info; // NAPixelChromaton MAX_CHROMATONS
		this.elem_size = data.elem_size; // u8
		this.be = data.be;
		this.alpha = data.alpha;
		this.palette = data.palette;
	}
	NAPixelFormaton.prototype.get_model = function() {
		return this.model;
	}
	NAPixelFormaton.prototype.get_num_comp = function() {
		return this.components;
	}
	NAPixelFormaton.prototype.get_chromaton = function(i) {
		return this.comp_info[i];
	}
	NAPixelFormaton.prototype.is_be = function() {
		return this.be;
	}
	NAPixelFormaton.prototype.has_alpha = function() {
		return this.alpha;
	}
	NAPixelFormaton.prototype.is_paletted = function() {
		return this.palette;
	}
	NAPixelFormaton.prototype.get_elem_size = function() {
		return this.elem_size;
	}
	NAPixelFormaton.prototype.is_unpacked = function() {
		//    if self.palette { return false; }
		//    for chromaton in self.comp_info.iter().flatten() {
		//        if chromaton.is_packed() { return false; }
		//    }
		//    true
	}
	NAPixelFormaton.prototype.get_max_depth = function() {
		console.log("4");

		//    let mut mdepth = 0;
		//    for chromaton in self.comp_info.iter().flatten() {
		//        mdepth = mdepth.max(chromaton.depth);
		//    }
		//    mdepth
	}
	NAPixelFormaton.prototype.get_total_depth = function() {
		console.log("4");
		//    let mut depth = 0;
		//    for chromaton in self.comp_info.iter().flatten() {
		//        depth += chromaton.depth;
		//    }
		//    depth
	}
	NAPixelFormaton.prototype.get_max_subsampling = function() {
		console.log("4");
		//    let mut ssamp = 0;
		//    for chromaton in self.comp_info.iter().flatten() {
		//        let (ss_v, ss_h) = chromaton.get_subsampling();
		//        ssamp = ssamp.max(ss_v).max(ss_h);
		//    }
		//    ssamp
	}
	NAPixelFormaton.prototype.to_short_string = function() {
		console.log("4");
	}

	const YUV420_FORMAT = new NAPixelFormaton({
		model: new ColorModel(ColorModel.YUV, new YUVSubmodel(YUVSubmodel.YUVJ)),
		components: 3,
		comp_info: [
			new NAPixelChromaton({ h_ss: 0, v_ss: 0, packed: false, depth: 8, shift: 0, comp_offs: 0, next_elem: 1 }),
			new NAPixelChromaton({ h_ss: 1, v_ss: 1, packed: false, depth: 8, shift: 0, comp_offs: 1, next_elem: 1 }),
			new NAPixelChromaton({ h_ss: 1, v_ss: 1, packed: false, depth: 8, shift: 0, comp_offs: 2, next_elem: 1 }),
			null,
			null
		],
		elem_size: 0,
		be: false,
		alpha: false,
		palette: false
	});

	//// frame ////

	const NAVideoInfo = function(w, h, flip, fmt) {
		this.width = w;
		this.height = h;
		this.flipped = flip;
		this.format = fmt;
		this.bits = 0;
	}
	NAVideoInfo.prototype.get_width = function() {
		return this.width;
	}
	NAVideoInfo.prototype.get_height = function() {
		return this.height;
	}
	NAVideoInfo.prototype.is_flipped = function() {
		return this.flipped;
	}
	NAVideoInfo.prototype.get_format = function() {
		return this.format;
	}
	NAVideoInfo.prototype.set_width = function(w) {
		this.width = w;
	}
	NAVideoInfo.prototype.set_height = function(h) {
		this.height = h;
	}

	function get_plane_size(info, idx) {
		let chromaton = info.get_format().get_chromaton(idx);
		if (chromaton === null) {
			return [0, 0];
		}
		let [hs, vs] = chromaton.get_subsampling();
		let w = (info.get_width() + ((1 << hs) - 1)) >> hs;
		let h = (info.get_height() + ((1 << vs) - 1)) >> vs;
		return [w, h];
	}

	const NAVideoBuffer = function(data) {
		this.info = data.info;
		this.data = data.data;
		this.offs = data.offs;
		this.strides = data.strides;
	}
	NAVideoBuffer.prototype.get_num_refs = function() {
		return 1;
	}
	NAVideoBuffer.prototype.get_info = function() {
		return this.info;
	}
	NAVideoBuffer.prototype.get_data = function() {
		return this.data;
	}
	NAVideoBuffer.prototype.get_dimensions = function(idx) {
		return get_plane_size(this.info, idx);
	}
	NAVideoBuffer.prototype.get_offset = function(idx) {
		if (idx >= this.offs.length) {
			return 0;
		} else {
			return this.offs[idx];
		}
	}
	NAVideoBuffer.prototype.get_stride = function(idx) {
		if (idx >= this.strides.length) {
			return 0;
		}
		return this.strides[idx];
	}
	NAVideoBuffer.prototype.cloned = function() {
		return new NAVideoBuffer({
			info: this.info,
			data: this.data.slice(0),
			offs: this.offs,
			strides: this.strides
		});
	}

	const NABufferType = function(type, value) {
		this.type = type;
		this.value = value;
	}
	NABufferType.Video = 1;
	NABufferType.Video16 = 2;
	NABufferType.Video32 = 3;
	NABufferType.VideoPacked = 4;
	NABufferType.Data = 5;
	NABufferType.None = 6;
	NABufferType.prototype.get_vbuf = function() {
		return this.value;
	}

	const NA_SIMPLE_VFRAME_COMPONENTS = 4;

	const NASimpleVideoFrame = function(data) {
		this.width = data.width;
		this.height = data.height;
		this.flip = data.flip;
		this.stride = data.stride;
		this.offset = data.offset;
		this.components = data.components;
		this.data = data.data;
	}
	NASimpleVideoFrame.from_video_buf = function(vbuf) {
		let vinfo = vbuf.get_info();
		let components = vinfo.format.components;
		if (components > NA_SIMPLE_VFRAME_COMPONENTS) {
			return null;
		}
		let w = new Uint32Array(NA_SIMPLE_VFRAME_COMPONENTS);
		let h = new Uint32Array(NA_SIMPLE_VFRAME_COMPONENTS);
		let s = new Uint32Array(NA_SIMPLE_VFRAME_COMPONENTS);
		let o = new Uint32Array(NA_SIMPLE_VFRAME_COMPONENTS);
		for (var comp = 0; comp < components; comp++) {
			let [width, height] = vbuf.get_dimensions(comp);
			w[comp] = width;
			h[comp] = height;
			s[comp] = vbuf.get_stride(comp);
			o[comp] = vbuf.get_offset(comp);
		}
		let flip = vinfo.flipped;
		return new NASimpleVideoFrame({
			width: w,
			height: h,
			flip,
			stride: s,
			offset: o,
			components,
			data: vbuf.data,
		});
	}

	function alloc_video_buffer(vinfo, align) {
		let fmt = vinfo.format;
		let new_size = 0;
		let offs = [];
		let strides = [];
		for (var i = 0; i < fmt.get_num_comp(); i++) {
			if (!fmt.get_chromaton(i)) {
				throw new Error("AllocatorError::FormatError");
			}
		}
		let align_mod = (1 << align) - 1;
		let width = (vinfo.width + align_mod) - align_mod;
		let height = (vinfo.height + align_mod) - align_mod;
		let max_depth = 0;
		let all_packed = true;
		let all_bytealigned = true;
		for (var i = 0; i < fmt.get_num_comp(); i++) {
			let ochr = fmt.get_chromaton(i);
			if (!ochr) continue;
			let chr = ochr;
			if (!chr.is_packed()) {
				all_packed = false;
			} else if (((chr.get_shift() + chr.get_depth()) & 7) != 0) {
				all_bytealigned = false;
			}
			max_depth = Math.max(max_depth, chr.get_depth());
		}
		let unfit_elem_size = false;
		switch(fmt.get_elem_size()) {
			case 2:
			case 4:
				unfit_elem_size = true;
				break;
		}
		unfit_elem_size = !unfit_elem_size;
		if (fmt.is_paletted()) {
			console.log("is_paletted");
		} else if (!all_packed) {
			for (var i = 0; i < fmt.get_num_comp(); i++) {
				let ochr = fmt.get_chromaton(i);
				if (!ochr) continue;
				let chr = ochr;
				offs.push(new_size);
				let stride = chr.get_linesize(width);
				let cur_h = chr.get_height(height);
				let cur_sz = (stride * cur_h);
				let new_sz = (new_size + cur_sz);
				new_size = new_sz;
				strides.push(stride);
			}
			if (max_depth <= 8) {
				let data = new Uint8Array(new_size);
				let buf = new NAVideoBuffer({
					data: data,
					info: vinfo,
					offs,
					strides
				});
				return new NABufferType(NABufferType.Video, buf);
			} else if (max_depth <= 16) {
				console.log("16");
			} else {
				console.log("any");
			}
		} else if (all_bytealigned || unfit_elem_size) {
			console.log("any");
		} else {
			console.log("none");
		}
	}

	const NAVideoBufferPool = function(max_len) {
		this.pool = [];
		this.max_len = max_len;
		this.add_len = 0;
	}
	NAVideoBufferPool.prototype.set_dec_bufs = function(add_len) {
		this.add_len = add_len;
	}
	NAVideoBufferPool.prototype.reset = function() {
		this.pool = [];
	}
	NAVideoBufferPool.prototype.prealloc_video = function(vinfo, align) {
		let nbufs = this.max_len + this.add_len - this.pool.length;
		for (var _ = 0; _ < nbufs; _++) {
			let vbuf = alloc_video_buffer(vinfo, align);
			var buf = vbuf.value;
			this.pool.push(buf);
		}
	}
	NAVideoBufferPool.prototype.get_free = function() {
		for (var i = 0; i < this.pool.length; i++) {
			var e = this.pool[i];
			if (e.get_num_refs() == 1) 
				return e;
		}
		return null;
	}
	NAVideoBufferPool.prototype.get_info = function() {
		if (this.pool.length) {
			return (this.pool[0].get_info())
		} else {
			return null;
		}
	}

	const NADecoderSupport = function() {
		this.pool_u8 = new NAVideoBufferPool(0); // NAVideoBufferPool<u8>; 
	}

	////////// nihav-duck //////////

	//////// vp6data ////////

	const VERSION_VP60 = 6; // u8
	const VERSION_VP62 = 8; // u8
	const VP6_SIMPLE_PROFILE = 0; // u8
	const VP6_ADVANCED_PROFILE = 3; // u8
	const LONG_VECTOR_ORDER = new Uint32Array([0, 1, 2, 7, 6, 5, 4]); // usize
	const NZ_PROBS = new Uint8Array([162, 164]);
	const RAW_PROBS = [new Uint8Array([247, 210, 135, 68, 138, 220, 239, 246]),new Uint8Array([244, 184, 201, 44, 173, 221, 239, 253])];
	const TREE_PROBS = [new Uint8Array([225, 146, 172, 147, 214,  39, 156]),new Uint8Array([204, 170, 119, 235, 140, 230, 228])];
	const ZERO_RUN_PROBS = [new Uint8Array([198, 197, 196, 146, 198, 204, 169, 142, 130, 136, 149, 149, 191, 249]),new Uint8Array([135, 201, 181, 154,  98, 117, 132, 126, 146, 169, 184, 240, 246, 254])];
	const HAS_NZ_PROB = new Uint8Array([237, 231]);
	const HAS_SIGN_PROB = new Uint8Array([246, 243]);
	const HAS_TREE_PROB = [new Uint8Array([253, 253, 254, 254, 254, 254, 254]), new Uint8Array([245, 253, 254, 254, 254, 254, 254])];
	const HAS_RAW_PROB = [new Uint8Array([254, 254, 254, 254, 254, 250, 250, 252]),new Uint8Array([254, 254, 254, 254, 254, 251, 251, 254])];
	const HAS_COEF_PROBS = [new Uint8Array([146, 255, 181, 207, 232, 243, 238, 251, 244, 250, 249]),new Uint8Array([179, 255, 214, 240, 250, 255, 244, 255, 255, 255, 255])];
	const HAS_SCAN_UPD_PROBS = new Uint8Array([0, 132, 132, 159, 153, 151, 161, 170, 164, 162, 136, 110, 103, 114, 129, 118, 124, 125, 132, 136, 114, 110, 142, 135, 134, 123, 143, 126, 153, 183, 166, 161, 171, 180, 179, 164, 203, 218, 225, 217, 215, 206, 203, 217, 229, 241, 248, 243, 253, 255, 253, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]);
	const HAS_ZERO_RUN_PROBS = [new Uint8Array([219, 246, 238, 249, 232, 239, 249, 255, 248, 253, 239, 244, 241, 248]),new Uint8Array([198, 232, 251, 253, 219, 241, 253, 255, 248, 249, 244, 238, 251, 255])];
	const VP6_AC_PROBS = [[[new Uint8Array([227, 246, 230, 247, 244, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 209, 231, 231, 249, 249, 253, 255, 255, 255]),new Uint8Array([255, 255, 225, 242, 241, 251, 253, 255, 255, 255, 255]),new Uint8Array([255, 255, 241, 253, 252, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 248, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])], [new Uint8Array([240, 255, 248, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 240, 253, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])]], [[new Uint8Array([206, 203, 227, 239, 247, 255, 253, 255, 255, 255, 255]),new Uint8Array([207, 199, 220, 236, 243, 252, 252, 255, 255, 255, 255]),new Uint8Array([212, 219, 230, 243, 244, 253, 252, 255, 255, 255, 255]),new Uint8Array([236, 237, 247, 252, 253, 255, 255, 255, 255, 255, 255]),new Uint8Array([240, 240, 248, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])], [new Uint8Array([230, 233, 249, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([238, 238, 250, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([248, 251, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])]], [[new Uint8Array([225, 239, 227, 231, 244, 253, 243, 255, 255, 253, 255]),new Uint8Array([232, 234, 224, 228, 242, 249, 242, 252, 251, 251, 255]),new Uint8Array([235, 249, 238, 240, 251, 255, 249, 255, 253, 253, 255]),new Uint8Array([249, 253, 251, 250, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([251, 250, 249, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])], [new Uint8Array([243, 244, 250, 250, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([249, 248, 250, 253, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([253, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])]]];
	const VP6_DC_WEIGHTS = [[new Int16Array([122, 133]),new Int16Array([133, 51]),new Int16Array([142, -16])], [new Int16Array([0, 1]),new Int16Array([0, 1]),new Int16Array([0, 1])], [new Int16Array([78, 171]),new Int16Array([169, 71]),new Int16Array([221, -30])], [new Int16Array([139, 117]),new Int16Array([214, 44]),new Int16Array([246, -3])], [new Int16Array([168, 79]),new Int16Array([210, 38]),new Int16Array([203, 17])]];
	const VP6_IDX_TO_AC_BAND = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
	const VP6_BICUBIC_COEFFS = [[[0, 128, 0, 0],[-3, 122, 9, 0],[-4, 109, 24, -1],[-5, 91, 45, -3],[-4, 68, 68, -4],[-3, 45, 91, -5],[-1, 24, 109, -4],[ 0, 9, 122, -3]], [[0, 128, 0, 0],[-4, 124, 9, -1],[-5, 110, 25, -2],[-6, 91, 46, -3],[-5, 69, 69, -5],[-3, 46, 91, -6],[-2, 25, 110, -5],[-1, 9, 124, -4]], [[ 0, 128, 0, 0],[-4, 123, 10, -1],[-6, 110, 26, -2],[-7, 92, 47, -4],[-6, 70, 70, -6],[-4, 47, 92, -7],[-2, 26, 110, -6],[-1, 10, 123, -4]], [[0, 128, 0, 0],[-5, 124, 10, -1],[-7, 110, 27, -2],[-7, 91, 48, -4],[-6, 70, 70, -6],[-4, 48, 92, -8],[-2, 27, 110, -7],[-1, 10, 124, -5]], [[0, 128, 0, 0],[-6, 124, 11, -1],[-8, 111, 28, -3],[-8, 92, 49, -5],[-7, 71, 71, -7],[-5, 49, 92, -8],[-3, 28, 111, -8],[-1, 11, 124, -6]], [[0, 128, 0, 0],[-6, 123, 12, -1],[-9, 111, 29, -3],[-9, 93, 50, -6],[-8, 72, 72, -8],[-6, 50, 93, -9],[-3, 29, 111, -9],[-1, 12, 123, -6]], [[0, 128, 0, 0],[-7, 124, 12, -1],[-10, 111, 30, -3],[-10, 93, 51, -6],[-9, 73, 73, -9],[-6, 51, 93, -10],[-3, 30, 111, -10],[-1, 12, 124, -7]], [[0, 128, 0, 0],[-7, 123, 13, -1],[-11, 112, 31, -4],[-11, 94, 52, -7],[-10, 74, 74, -10],[-7, 52, 94, -11],[-4, 31, 112, -11],[-1, 13, 123, -7]], [[0, 128, 0, 0],[-8, 124, 13, -1],[-12, 112, 32, -4],[-12, 94, 53, -7],[-10, 74, 74, -10],[-7, 53, 94, -12],[-4, 32, 112, -12],[-1, 13, 124, -8]], [[0, 128, 0, 0],[-9, 124, 14, -1],[-13, 112, 33, -4],[-13, 95, 54, -8],[-11, 75, 75, -11],[-8, 54, 95, -13],[-4, 33, 112, -13],[-1, 14, 124, -9]], [[0, 128, 0, 0],[-9, 123, 15, -1],[-14, 113, 34, -5],[-14, 95, 55, -8],[-12, 76, 76, -12],[-8, 55, 95, -14],[-5, 34, 112, -13],[-1, 15, 123, -9]], [[0, 128, 0, 0],[-10, 124, 15, -1],[-14, 113, 34, -5],[-15, 96, 56, -9],[-13, 77, 77, -13],[-9, 56, 96, -15],[-5, 34, 113, -14],[-1, 15, 124, -10]], [[0, 128, 0, 0],[-10, 123, 16, -1],[-15, 113, 35, -5],[-16, 98, 56, -10],[-14, 78, 78, -14],[-10, 56, 98, -16],[-5, 35, 113, -15],[-1, 16, 123, -10]], [[0, 128, 0, 0],[-11, 124, 17, -2],[-16, 113, 36, -5],[-17, 98, 57, -10],[-14, 78, 78, -14],[-10, 57, 98, -17],[-5, 36, 113, -16],[-2, 17, 124, -11]], [[0, 128, 0, 0],[-12, 125, 17, -2],[-17, 114, 37, -6],[-18, 99, 58, -11],[-15, 79, 79, -15],[-11, 58, 99, -18],[-6, 37, 114, -17],[-2, 17, 125, -12]], [[0, 128, 0, 0],[-12, 124, 18, -2],[-18, 114, 38, -6],[-19, 99, 59, -11],[-16, 80, 80, -16],[-11, 59, 99, -19],[-6, 38, 114, -18],[-2, 18, 124, -12]], [[0, 128, 0, 0],[-4, 118, 16, -2],[-7, 106, 34, -5],[-8,  90, 53, -7],[-8,  72, 72, -8],[-7,  53, 90, -8],[-5,  34, 106, -7],[-2,  16, 118, -4]]];
	const VP6_DEFAULT_SCAN_ORDER = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9, 9, 9, 10, 10, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15];
	const VP6_INTERLACED_SCAN_ORDER = [0, 1, 0, 1, 1, 2, 5, 3, 2, 2, 2, 2, 4, 7, 8, 10, 9, 7, 5, 4, 2, 3, 5, 6, 8, 9, 11, 12, 13, 12, 11, 10, 9, 7, 5, 4, 6, 7, 9, 11, 12, 12, 13, 13, 14, 12, 11, 9, 7, 9, 11, 12, 14, 14, 14, 15, 13, 11, 13, 15, 15, 15, 15, 15];

	//// vpcommon ////

	const VP_YUVA420_FORMAT = new NAPixelFormaton({
		model: new ColorModel(ColorModel.YUV, new YUVSubmodel(YUVSubmodel.YUVJ)),
		components: 4,
		comp_info:  [
			new NAPixelChromaton({ h_ss: 0, v_ss: 0, packed: false, depth: 8, shift: 0, comp_offs: 0, next_elem: 1}),
			new NAPixelChromaton({ h_ss: 1, v_ss: 1, packed: false, depth: 8, shift: 0, comp_offs: 1, next_elem: 1}),
			new NAPixelChromaton({ h_ss: 1, v_ss: 1, packed: false, depth: 8, shift: 0, comp_offs: 2, next_elem: 1}),
			new NAPixelChromaton({ h_ss: 0, v_ss: 0, packed: false, depth: 8, shift: 0, comp_offs: 3, next_elem: 1}),
			null],
		elem_size:  0,
		be:         false,
		alpha:      true,
		palette:    false
	});

	const VP_REF_INTER = 1;
	const VP_REF_GOLDEN = 2;

	const VPMBType = function(type) {
		this.type = type;
	}
	VPMBType.Intra = 1;
	VPMBType.InterNoMV = 2;
	VPMBType.InterMV = 3;
	VPMBType.InterNearest = 4;
	VPMBType.InterNear = 5;
	VPMBType.InterFourMV = 6;
	VPMBType.GoldenNoMV = 7;
	VPMBType.GoldenMV = 8;
	VPMBType.GoldenNearest = 9;
	VPMBType.GoldenNear = 10;
	VPMBType.prototype.is_intra = function() {
		return this.type == VPMBType.Intra;
	}
	VPMBType.prototype.get_ref_id = function() {
		switch(this.type) {
			case VPMBType.Intra:
				return 0;
			case VPMBType.InterNoMV:
			case VPMBType.InterMV:
			case VPMBType.InterNearest:
			case VPMBType.InterNear:
			case VPMBType.InterFourMV:
				return VP_REF_INTER;
			default:
				return VP_REF_GOLDEN;
		}
	}

	const VPShuffler = function() {
		this.lastframe = null;
		this.goldframe = null;
	}
	VPShuffler.prototype.clear = function() {
		this.lastframe = null;
		this.goldframe = null;
	}
	VPShuffler.prototype.add_frame = function(buf) {
		this.lastframe = null;
		this.lastframe = buf;
	}
	VPShuffler.prototype.add_golden_frame = function(buf) {
		this.goldframe = null;
		this.goldframe = buf;
	}
	VPShuffler.prototype.get_last = function() {
		return this.lastframe; // TODO cloned
	}
	VPShuffler.prototype.get_golden = function() {
		return this.goldframe; // TODO cloned
	}
	VPShuffler.prototype.has_refs = function() {
		return !!this.lastframe;
	}

	const VP56_COEF_BASE = new Int16Array([5, 7, 11, 19, 35, 67]);
	const VP56_COEF_ADD_PROBS = [
		new Uint8Array([159, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
		new Uint8Array([165, 145, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
		new Uint8Array([173, 148, 140, 128, 0, 0, 0, 0, 0, 0, 0, 0]),
		new Uint8Array([176, 155, 140, 135, 128, 0, 0, 0, 0, 0, 0, 0]),
		new Uint8Array([180, 157, 141, 134, 130, 128, 0, 0, 0, 0, 0, 0]),
		new Uint8Array([254, 254, 243, 230, 196, 177, 153, 140, 133, 130, 129, 128]),
	];

	const ff_vp56_norm_shift = new Uint8Array([8, 7, 6, 6, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

	const BoolCoder = function(src) {
		if (src.length < 3) 
			throw new Error("DecoderError::ShortData");
		let value = asU32(asU32(src[0] << 24) | asU32(src[1] << 16) | asU32(src[2] << 8) | asU32(src[3]));
		this.src = src;
		this.pos = 4;
		this.value = value;
		this.range = 255;
		this.bits = 8;
	}
	BoolCoder.prototype.read_bool = function() {
		return this.read_prob(128);
	}
	BoolCoder.prototype.read_prob = function(prob) {
		this.renorm();
		let split = asU32(1 + asU32((asU32(this.range - 1) * asU32(prob)) >> 8));
		let bit;
		if (asU32(this.value) < asU32(split << 24)) {
			this.range = split;
			bit = false;
		} else {
			this.range -= split;
			this.range = asU32(this.range);
			this.value -= asU32(split << 24);
			this.value = asU32(this.value);
			bit = true;
		}
		return bit;
	}
	BoolCoder.prototype.read_bits = function(bits) {
		let val = 0;
		for (var i = 0; i < bits; i++) {
			val = (val << 1) | asU32(this.read_prob(128));
			val = asU32(val);
		}
		return asU32(val);
	}
	BoolCoder.prototype.read_probability = function() {
		let val = asU8(this.read_bits(7));
		if (val == 0) {
			return 1;
		} else {
			return asU8(val << 1);
		}
	}
	BoolCoder.prototype.renorm = function() {
		let shift = ff_vp56_norm_shift[this.range];
		this.range <<= asU32(shift);
		this.value <<= asU32(shift);
		this.range = asU32(this.range);
		this.value = asU32(this.value);
		this.bits -= asI32(shift);
		if ((this.bits <= 0) && (this.pos < this.src.length)) {
			this.value |= (this.src[this.pos] << asU8(-this.bits));
			this.pos += 1;
			this.bits += 8;
		}
	}
	BoolCoder.prototype.skip_bytes = function(nbytes) {
		for (var i = 0; i < nbytes; i++) {
			this.value <<= 8;
			if (this.pos < this.src.length) {
				this.value |= (this.src[this.pos]);
				this.pos += 1;
			}
		}
	}

	function rescale_prob(prob, weights, maxval) {
		return asU8(Math.max(Math.min((((asI32(asU8(prob)) * asI32(weights[0]) + 128) >> 8) + asI32(weights[1])), maxval), 1));
	}

	const C1S7 = 64277;
	const C2S6 = 60547;
	const C3S5 = 54491;
	const C4S4 = 46341;
	const C5S3 = 36410;
	const C6S2 = 25080;
	const C7S1 = 12785;

	function mul16(a, b) {
		return (a * b) >> 16;
	}

	function idct_step(src, dst, $s0, $s1, $s2, $s3, $s4, $s5, $s6, $s7, $d0, $d1, $d2, $d3, $d4, $d5, $d6, $d7, $bias, $shift, $otype) {
		var t_a  = mul16(C1S7, (src[$s1])) + mul16(C7S1, src[$s7]);
		var t_b  = mul16(C7S1, (src[$s1])) - mul16(C1S7, src[$s7]);
		var t_c  = mul16(C3S5, (src[$s3])) + mul16(C5S3, src[$s5]);
		var t_d  = mul16(C3S5, (src[$s5])) - mul16(C5S3, src[$s3]);
		var t_a1 = mul16(C4S4, t_a - t_c);
		var t_b1 = mul16(C4S4, t_b - t_d);
		var t_c  = t_a + t_c;
		var t_d  = t_b + t_d;
		var t_e  = mul16(C4S4, (src[$s0] + src[$s4])) + $bias;
		var t_f  = mul16(C4S4, (src[$s0] - src[$s4])) + $bias;
		var t_g  = mul16(C2S6, (src[$s2])) + mul16(C6S2, (src[$s6]));
		var t_h  = mul16(C6S2, (src[$s2])) - mul16(C2S6, (src[$s6]));
		var t_e1 = (t_e - t_g);
		var t_g  = (t_e + t_g);
		var t_a  = (t_f + t_a1);
		var t_f  = (t_f - t_a1);
		var t_b  = (t_b1 - t_h);
		var t_h  = (t_b1 + t_h);
		dst[$d0] = $otype((t_g  + t_c) >> $shift);
		dst[$d1] = $otype((t_a  + t_h) >> $shift);
		dst[$d2] = $otype((t_a  - t_h) >> $shift);
		dst[$d3] = $otype((t_e1 + t_d) >> $shift);
		dst[$d4] = $otype((t_e1 - t_d) >> $shift);
		dst[$d5] = $otype((t_f  + t_b) >> $shift);
		dst[$d6] = $otype((t_f  - t_b) >> $shift);
		dst[$d7] = $otype((t_g  - t_c) >> $shift);
	}

	function vp_idct(coeffs) {
		let tmp = new Int32Array(64);
		for (var i = 0; i < 8; i++) {
			idct_step(
				coeffs, tmp,
				(i * 8), (i * 8) + 1, (i * 8) + 2, (i * 8) + 3, (i * 8) + 4, (i * 8) + 5, (i * 8) + 6, (i * 8) + 7,
				(i * 8), (i * 8) + 1, (i * 8) + 2, (i * 8) + 3, (i * 8) + 4, (i * 8) + 5, (i * 8) + 6, (i * 8) + 7,
				0, 0, asI32
			);
		}
		for (var i = 0; i < 8; i++) {
			idct_step(
				tmp, coeffs,
				(0 * 8) + i, (1 * 8) + i, (2 * 8) + i, (3 * 8) + i, (4 * 8) + i, (5 * 8) + i, (6 * 8) + i, (7 * 8) + i,
				(0 * 8) + i, (1 * 8) + i, (2 * 8) + i, (3 * 8) + i, (4 * 8) + i, (5 * 8) + i, (6 * 8) + i, (7 * 8) + i,
				8, 4, asI16
			);
		}
	}

	function vp_idct_dc(coeffs) {
		let dc = asI16((mul16(C4S4, mul16(C4S4, asI32(coeffs[0]))) + 8) >> 4);
		for (let i = 0; i < 64; i++) {
			coeffs[i] = dc;
		}
	}

	function vp_put_block(coeffs, bx, by, plane, frm) {
		vp_idct(coeffs);
		let off = frm.offset[plane] + ((bx * 8) + ((by * 8) * frm.stride[plane]));
		for (var y = 0; y < 8; y++) {
			for (var x = 0; x < 8; x++) {
				frm.data[off + x] = asU8(Math.max(Math.min((coeffs[x + (y * 8)] + 128), 255), 0));
			}
			off += frm.stride[plane];
		}
	}

	function vp_put_block_ilace(coeffs, bx, by, plane, frm) {
		vp_idct(coeffs);
		let off = frm.offset[plane] + bx * 8 + ((by - 1) * 8 + (by + 1)) * frm.stride[plane];
		for (let y = 0; y < array.length; y++) {
			for (let x = 0; x < array.length; x++) {
				frm.data[off + x] = asU8(Math.max(Math.min((coeffs[x + y * 8] + 128), 255), 0));
			}
			off += frm.stride[plane] * 2;
		}
	}

	function vp_put_block_dc(coeffs, bx, by, plane, frm) {
		vp_idct_dc(coeffs);
		let dc = asU8(Math.max(Math.min((coeffs[0] + 128), 255), 0));
		let off = frm.offset[plane] + bx * 8 + by * 8 * frm.stride[plane];
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				frm.data[off + x] = dc;
			}
			off += frm.stride[plane];
		}
	}

	function vp_add_block(coeffs, bx, by, plane, frm) {
		vp_idct(coeffs);
		let off = frm.offset[plane] + bx * 8 + by * 8 * frm.stride[plane];
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				frm.data[off + x] = asU8(Math.max(Math.min((coeffs[x + y * 8] + asI16(frm.data[off + x])), 255), 0));
			}
			off += frm.stride[plane];
		}
	}

	function vp_add_block_ilace(coeffs, bx, by, plane, frm) {
		vp_idct(coeffs);
		let off = frm.offset[plane] + bx * 8 + ((by - 1) * 8 + (by + 1)) * frm.stride[plane];
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				frm.data[off + x] = asU8(Math.max(Math.min((coeffs[x + y * 8] + asI16(frm.data[off + x])), 255), 0));
			}
			off += frm.stride[plane] * 2;
		}
	}

	function vp_add_block_dc(coeffs, bx, by, plane, frm) {
		vp_idct_dc(coeffs);
		let dc = coeffs[0];
		let off = frm.offset[plane] + bx * 8 + by * 8 * frm.stride[plane];
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				frm.data[off + x] = asU8(Math.max(Math.min((dc + asI16(frm.data[off + x])), 255), 0));
			}
			off += frm.stride[plane];
		}
	}

	function vp31_loop_filter(data, off, step, stride, len, loop_str) {
		for (let _ = 0; _ < len; _++) {
			let a = asI16(data[off - step * 2]);
			let b = asI16(data[off - step]);
			let c = asI16(data[off]);
			let d = asI16(data[off + step]);
			let diff = ((a - d) + 3 * (c - b) + 4) >> 3;
			if (Math.abs(diff) >= 2 * loop_str) {
				diff = 0;
			} else if (Math.abs(diff) >= loop_str) {
				if (diff < 0) {
					diff = -diff - 2 * loop_str;
				} else {
					diff = -diff + 2 * loop_str;
				}
			}
			if (diff != 0) {
				data[off - step] = asU8(Math.min(Math.max((b + diff), 0), 255));
				data[off] = asU8(Math.min(Math.max((c - diff), 0), 255));
			}
			off += stride;
		}
	}

	//// vp56 ////

	const VP56Header = function() {
		this.is_intra = false;
		this.is_golden = false;
		this.quant = 0;
		this.multistream = false;
		this.use_huffman = false;
		this.version = 0;
		this.profile = 0;
		this.interlaced = false;
		this.offset = 0;
		this.mb_w = 0;
		this.mb_h = 0;
		this.disp_w = 0;
		this.disp_h = 0;
		this.scale = 0;
	}

	const CoeffReader = function(type, value) {
		this.type = type;
		this.value = value;
	}
	CoeffReader.None = 1;
	CoeffReader.Bool = 2;
	CoeffReader.Huff = 3;

	const VP56MVModel = function() {
		this.nz_prob = 0;
		this.sign_prob = 0;
		this.raw_probs = new Uint8Array(8);
		this.tree_probs = new Uint8Array(7);
	}

	const VP56MBTypeModel = function() {
		this.probs = new Uint8Array(10);
	}

	const VP56CoeffModel = function() {
		this.dc_token_probs = [[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)]];
		this.dc_value_probs = new Uint8Array(11);
		this.ac_ctype_probs = [[[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)]], [[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)]], [[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)],[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)]]];
		this.ac_type_probs = [[[[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)]],[[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)]],[[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)]]]];
		this.ac_val_probs = [[new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11)], [new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11)], [new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11)]];
	}

	const VP6Models = function() {
		this.scan_order = new Uint32Array(64);
		this.scan = new Uint32Array(64);
		this.zigzag = new Uint32Array(64);
		this.zero_run_probs = [new Uint8Array(14), new Uint8Array(14)]
	}

	const MAX_HUFF_ELEMS = 12;

	const VP6Huff = function() {
		this.codes = new Uint16Array(MAX_HUFF_ELEMS);
		this.bits = new Uint8Array(MAX_HUFF_ELEMS);
	}

	function prob2weight(a, b) {
		let w = asU8((a * b) >> 8);
		if (w == 0) {
			return 1;
		} else {
			return w;
		}
	}

	const VP56_DC_QUANTS = [47, 47, 47, 47, 45, 43, 43, 43, 43, 43, 42, 41, 41, 40, 40, 40, 40, 35, 35, 35, 35, 33, 33, 33, 33, 32, 32, 32, 27, 27, 26, 26, 25, 25, 24, 24, 23, 23, 19, 19, 19, 19, 18, 18, 17, 16, 16, 16, 16, 16, 15, 11, 11, 11, 10, 10, 9, 8, 7, 5, 3, 3, 2, 2];
	const VP56_AC_QUANTS = [94, 92, 90, 88, 86, 82, 78, 74, 70, 66, 62, 58, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 40, 39, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10,  9, 8, 7, 6, 5, 4, 3, 2, 1];
	const VP56_FILTER_LIMITS = [14, 14, 13, 13, 12, 12, 10, 10, 10, 10,  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 2];
	const VP56_MODE_VQ = [[[9, 15, 32, 25, 7, 19, 9, 21, 1, 12, 14, 12, 3, 18, 14, 23, 3, 10, 0, 4], [48, 39, 1, 2, 11, 27, 29, 44, 7, 27, 1, 4, 0, 3, 1, 6, 1, 2, 0, 0], [21, 32, 1, 2, 4, 10, 32, 43, 6, 23, 2, 3, 1, 19, 1, 6, 12, 21, 0, 7], [69, 83, 0, 0, 0, 2, 10, 29, 3, 12, 0, 1, 0, 3, 0, 3, 2, 2, 0, 0], [11, 20, 1, 4, 18, 36, 43, 48, 13, 35, 0, 2, 0, 5, 3, 12, 1, 2, 0, 0], [70, 44, 0, 1, 2, 10, 37, 46, 8, 26, 0, 2, 0, 2, 0, 2, 0, 1, 0, 0], [8, 15, 0, 1, 8, 21, 74, 53, 22, 42, 0, 1, 0, 2, 0, 3, 1, 2, 0, 0], [141, 42, 0, 0, 1, 4, 11, 24, 1, 11, 0, 1, 0, 1, 0, 2, 0, 0, 0, 0], [8, 19, 4, 10, 24, 45, 21, 37, 9, 29, 0, 3, 1, 7, 11, 25, 0, 2, 0, 1], [46, 42, 0, 1, 2, 10, 54, 51, 10, 30, 0, 2, 0, 2, 0, 1, 0, 1, 0, 0], [28, 32, 0, 0, 3, 10, 75, 51, 14, 33, 0, 1, 0, 2, 0, 1, 1, 2, 0, 0], [100, 46, 0, 1, 3, 9, 21, 37, 5, 20, 0, 1, 0, 2, 1, 2, 0, 1, 0, 0], [27, 29, 0, 1, 9, 25, 53, 51, 12, 34, 0, 1, 0, 3, 1, 5, 0, 2, 0, 0], [80, 38, 0, 0, 1, 4, 69, 33, 5, 16, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0], [16, 20, 0, 0, 2, 8, 104, 49, 15, 33, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0], [194, 16, 0, 0, 1, 1, 1, 9, 1, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0]], [[41, 22, 1, 0, 1, 31, 0, 0, 0, 0, 0, 1, 1, 7, 0, 1, 98, 25, 4, 10], [123, 37, 6, 4, 1, 27, 0, 0, 0, 0, 5, 8, 1, 7, 0, 1, 12, 10, 0, 2], [26, 14, 14, 12, 0, 24, 0, 0, 0, 0, 55, 17, 1, 9, 0, 36, 5, 7, 1, 3], [209, 5, 0, 0, 0, 27, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0], [2, 5, 4, 5, 0, 121, 0, 0, 0, 0, 0, 3, 2, 4, 1, 4, 2, 2, 0, 1], [175, 5, 0, 1, 0, 48, 0, 0, 0, 0, 0, 2, 0, 1, 0, 2, 0, 1, 0, 0], [83, 5, 2, 3, 0, 102, 0, 0, 0, 0, 1, 3, 0, 2, 0, 1, 0, 0, 0, 0], [233, 6, 0, 0, 0, 8, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0], [34, 16, 112, 21, 1, 28, 0, 0, 0, 0, 6, 8, 1, 7, 0, 3, 2, 5, 0, 2], [159, 35, 2, 2, 0, 25, 0, 0, 0, 0, 3, 6, 0, 5, 0, 1, 4, 4, 0, 1], [75, 39, 5, 7, 2, 48, 0, 0, 0, 0, 3, 11, 2, 16, 1, 4, 7, 10, 0, 2], [212, 21, 0, 1, 0, 9, 0, 0, 0, 0, 1, 2, 0, 2, 0, 0, 2, 2, 0, 0], [4, 2, 0, 0, 0, 172, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 2, 0, 0, 0], [187, 22, 1, 1, 0, 17, 0, 0, 0, 0, 3, 6, 0, 4, 0, 1, 4, 4, 0, 1], [133, 6, 1, 2, 1, 70, 0, 0, 0, 0, 0, 2, 0, 4, 0, 3, 1, 1, 0, 0], [251, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], [[2, 3, 2, 3, 0, 2, 0, 2, 0, 0, 11, 4, 1, 4, 0, 2, 3, 2, 0, 4], [49, 46, 3, 4, 7, 31, 42, 41, 0, 0, 2, 6, 1, 7, 1, 4, 2, 4, 0, 1], [26, 25, 1, 1, 2, 10, 67, 39, 0, 0, 1, 1, 0, 14, 0, 2, 31, 26, 1, 6], [103, 46, 1, 2, 2, 10, 33, 42, 0, 0, 1, 4, 0, 3, 0, 1, 1, 3, 0, 0], [14, 31, 9, 13, 14, 54, 22, 29, 0, 0, 2, 6, 4, 18, 6, 13, 1, 5, 0, 1], [85, 39, 0, 0, 1, 9, 69, 40, 0, 0, 0, 1, 0, 3, 0, 1, 2, 3, 0, 0], [31, 28, 0, 0, 3, 14, 130, 34, 0, 0, 0, 1, 0, 3, 0, 1, 3, 3, 0, 1], [171, 25, 0, 0, 1, 5, 25, 21, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0], [17, 21, 68, 29, 6, 15, 13, 22, 0, 0, 6, 12, 3, 14, 4, 10, 1, 7, 0, 3], [51, 39, 0, 1, 2, 12, 91, 44, 0, 0, 0, 2, 0, 3, 0, 1, 2, 3, 0, 1], [81, 25, 0, 0, 2, 9, 106, 26, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0], [140, 37, 0, 1, 1, 8, 24, 33, 0, 0, 1, 2, 0, 2, 0, 1, 1, 2, 0, 0], [14, 23, 1, 3, 11, 53, 90, 31, 0, 0, 0, 3, 1, 5, 2, 6, 1, 2, 0, 0], [123, 29, 0, 0, 1, 7, 57, 30, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0], [13, 14, 0, 0, 4, 20, 175, 20, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0], [202, 23, 0, 0, 1, 3, 2, 9, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0]]];

	const INVALID_REF = 42;

	const VP6HuffModels = function() {
		this.dc_token_tree = [new VP6Huff(), new VP6Huff()];
		this.ac_token_tree = [
			[
				[new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff()],
				[new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff()],
				[new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff()]
			], [
				[new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff()],
				[new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff()],
				[new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff(), new VP6Huff()]
			]
		];
		this.zero_run_tree = [new VP6Huff(), new VP6Huff()];
	}
	
	const VP56Models = function() {
		this.mv_models = [new VP56MVModel(), new VP56MVModel()];
		this.mbtype_models = [
			[new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel()],
			[new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel()],
			[new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel()]
		];
		this.coeff_models = [new VP56CoeffModel(), new VP56CoeffModel()];
		this.prob_xmitted = [new Uint8Array(20), new Uint8Array(20), new Uint8Array(20)];
		this.vp6models = new VP6Models();
		this.vp6huff = new VP6HuffModels();
	}

	const MBInfo = function() {
		this.mb_type = new VPMBType(VPMBType.Intra);
		this.mv = new MV(0, 0);
	}

	const FrameState = function() {
		this.mb_x = 0;
		this.mb_y = 0;
		this.plane = 0;
		this.coeff_cat = [new Uint8Array(64), new Uint8Array(64), new Uint8Array(64), new Uint8Array(64)];
		this.last_idx = new Uint32Array(4);
		this.top_ctx = 0;
		this.ctx_idx = 0;
		this.dc_quant = 0;
		this.ac_quant = 0;
		this.dc_zero_run = new Uint32Array(2);
		this.ac_zero_run = new Uint32Array(2);
	}

	const VP56DCPred = function() {
		this.dc_y = new Int16Array(0);
		this.dc_u = new Int16Array(0);
		this.dc_v = new Int16Array(0);
		this.ldc_y = new Int16Array(2);
		this.ldc_u = 0;
		this.ldc_v = 0;
		this.ref_y = new Uint8Array(0);
		this.ref_c = new Uint8Array(0);
		this.ref_left = 0;
		this.y_idx = 0;
		this.c_idx = 0;
	}
	VP56DCPred.prototype.reset = function(mb_w) {
		this.update_row();
		for (var i = 1; i < this.ref_y.length; i++) {
			this.ref_y[i] = INVALID_REF;
		}
		for (var i = 1; i < this.ref_c.length; i++) {
			this.ref_c[i] = INVALID_REF;
		}
	}
	VP56DCPred.prototype.update_row = function() {
		this.y_idx = 1;
		this.c_idx = 1;
		this.ldc_y = new Int16Array(2);
		this.ldc_u = 0;
		this.ldc_v = 0;
		this.ref_left = INVALID_REF;
	}
	VP56DCPred.prototype.resize = function(mb_w) {
		this.dc_y = new Int16Array(mb_w * 2 + 2);
		this.dc_u = new Int16Array(mb_w + 2);
		this.dc_v = new Int16Array(mb_w + 2);
		this.ref_y = new Uint8Array(mb_w * 2 + 2);
		this.ref_y.fill(INVALID_REF);
		this.ref_c = new Uint8Array(mb_w + 2);
		this.ref_c.fill(INVALID_REF);
		this.ref_c[0] = 0;
	}
	VP56DCPred.prototype.next_mb = function() {
		this.y_idx += 2;
		this.c_idx += 1;
	}

	function rescale_mb_mode_prob(prob, total) {
		return asU8(255 * prob / (1 + total));
	}

	function map_mb_type(mbtype) {
		switch(mbtype.type) {
			case VPMBType.InterNoMV    : return 0;
			case VPMBType.Intra        : return 1;
			case VPMBType.InterMV      : return 2;
			case VPMBType.InterNearest : return 3;
			case VPMBType.InterNear    : return 4;
			case VPMBType.GoldenNoMV   : return 5;
			case VPMBType.GoldenMV     : return 6;
			case VPMBType.InterFourMV  : return 7;
			case VPMBType.GoldenNearest: return 8;
			case VPMBType.GoldenNear   : return 9;
		}
	}
	const VP56Decoder = function(version, hasAlpha, flip) {
		let vt = alloc_video_buffer(new NAVideoInfo(24, 24, false, VP_YUVA420_FORMAT), 4);

		this.version = version;
		this.has_alpha = hasAlpha;
		this.flip = flip;
		this.shuf = new VPShuffler();
		this.width = 0;
		this.height = 0;
		this.mb_w = 0;
		this.mb_h = 0;
		this.models = new VP56Models();
		this.amodels = new VP56Models();
		this.coeffs = [
			new Int16Array(64),
			new Int16Array(64),
			new Int16Array(64),
			new Int16Array(64),
			new Int16Array(64),
			new Int16Array(64)
		];
		this.last_mbt = new VPMBType(VPMBType.InterNoMV);

		this.loop_thr = 0;
		this.ilace_prob = 0;
		this.ilace_mb = false;

		this.mb_info = [];
		this.fstate = new FrameState();
		this.dc_pred = new VP56DCPred();
		this.last_dc = [new Int16Array(4), new Int16Array(4), new Int16Array(4)];
		this.top_ctx = [new Uint8Array(0), new Uint8Array(0), new Uint8Array(0), new Uint8Array(0)];

		this.mc_buf = vt.get_vbuf();
	}
	VP56Decoder.prototype.set_dimensions = function(width, height) {
		this.width = width;
		this.height = height;
		this.mb_w = (this.width + 15) >> 4;
		this.mb_h = (this.height + 15) >> 4;
		this.mb_info = [];
		for (var i = 0; i < this.mb_w * this.mb_h; i++) {
			this.mb_info.push(new MBInfo());
		}
		this.top_ctx = [
			new Uint8Array(this.mb_w * 2),
			new Uint8Array(this.mb_w),
			new Uint8Array(this.mb_w),
			new Uint8Array(this.mb_w * 2)
		];
	}
	VP56Decoder.prototype.init = function(supp, vinfo) {
		supp.pool_u8.set_dec_bufs(3 + (vinfo.get_format().has_alpha() ? 1 : 0));
		supp.pool_u8.prealloc_video(new NAVideoInfo(vinfo.get_width(), vinfo.get_height(), false, vinfo.get_format()), 4);
		this.set_dimensions(vinfo.get_width(), vinfo.get_height());
		this.dc_pred.resize(this.mb_w);
	}
	VP56Decoder.prototype.decode_frame = function(supp, src, br) {
		let aoffset;
		let bc;
		if (this.has_alpha) {
			validate(src.length >= 7);
			aoffset = ((src[0]) << 16) | ((src[1]) << 8) | (src[2]);
			validate((aoffset > 0) && (aoffset < src.length - 3));
			bc = new BoolCoder(src.subarray(3));
		} else {
			validate(src.length >= 4);
			aoffset = src.length;
			bc = new BoolCoder(src);
		}
		let hdr = br.parseHeader(bc);
		validate((hdr.offset) < aoffset);
		if (hdr.mb_w != 0 && (hdr.mb_w != this.mb_w || hdr.mb_h != this.mb_h)) {
			this.set_dimensions(hdr.mb_w * 16, hdr.mb_h * 16);
		}
		let fmt;
		if (!this.has_alpha) {
			fmt = YUV420_FORMAT;
		} else {
			fmt = VP_YUVA420_FORMAT;
		}
		let vinfo = new NAVideoInfo(this.width, this.height, this.flip, fmt);
		let ret = supp.pool_u8.get_free();
		if (ret === null) {
			throw new Error("DecoderError::AllocError");
		}
		let buf = ret;
		/*if (buf.get_info() !== vinfo) {
			this.shuf.clear();
			supp.pool_u8.reset();
			supp.pool_u8.prealloc_video(vinfo, 4);
			let ret = supp.pool_u8.get_free();
			if (ret === null) {
				throw new Error("DecoderError::AllocError");
			}
			buf = ret;
		}*/

		let dframe = NASimpleVideoFrame.from_video_buf(buf);
		if (hdr.is_intra) {
			this.shuf.clear();
		} else {
			if (!this.shuf.has_refs()) {
				throw new Error("DecoderError::MissingReference");
			}
		}

		let psrc = src.subarray(this.has_alpha ? 3 : 0);

		this.decode_planes(br, dframe, bc, hdr, psrc, false);
		if (this.has_alpha) {
			let asrc = src.subarray(aoffset + 3);
			let _bc = new BoolCoder(asrc);
			let ahdr = br.parseHeader(_bc);
			validate(ahdr.mb_w == hdr.mb_w && ahdr.mb_h == hdr.mb_h);
			var models = this.models;
			this.models = this.amodels;
			this.decode_planes(br, dframe, _bc, ahdr, asrc, true);
			this.models = models;
			if (hdr.is_golden && ahdr.is_golden) {
				this.shuf.add_golden_frame(buf.cloned());
			} else if (hdr.is_golden && !ahdr.is_golden) {
			} else if (!hdr.is_golden && ahdr.is_golden) {
			}
		}
		if (hdr.is_golden && !this.has_alpha) {
			this.shuf.add_golden_frame(buf.cloned());
		}
		this.shuf.add_frame(buf.cloned());
		return [new NABufferType(NABufferType.Video, buf), hdr.is_intra];
	}
	VP56Decoder.prototype.reset_mbtype_models = function() {
		const DEFAULT_XMITTED_PROBS = [
			new Uint8Array([ 42,  69, 2, 1, 7, 1, 42, 44, 22, 6, 3, 1, 2, 0, 5, 1, 1, 0, 0, 0 ]),
			new Uint8Array([  8, 229, 1, 1, 8, 0,  0,  0,  0, 0, 2, 1, 1, 0, 0, 0, 1, 1, 0, 0 ]),
			new Uint8Array([ 35, 122, 1, 1, 6, 1, 34, 46,  0, 0, 2, 1, 1, 0, 1, 0, 1, 1, 0, 0 ])
		];
		this.models.prob_xmitted[0].set(DEFAULT_XMITTED_PROBS[0], 0);
		this.models.prob_xmitted[1].set(DEFAULT_XMITTED_PROBS[1], 0);
		this.models.prob_xmitted[2].set(DEFAULT_XMITTED_PROBS[2], 0);
	}
	VP56Decoder.prototype.decode_planes = function(br, dframe, bc, hdr, src, alpha) {
		let cr;
		if (hdr.multistream) {
			let off = +hdr.offset.toString();
			if (!hdr.use_huffman) {
				let bc2 = new BoolCoder(src.subarray(off));
				cr = new CoeffReader(CoeffReader.Bool, bc2);
			} else {
				throw new Error("UnimplementedDecoding use_huffman");
			}
		} else {
			cr = new CoeffReader(CoeffReader.None);
		}
		if (hdr.is_intra) {
			br.reset_models(this.models);
			this.reset_mbtype_models();
		} else {
			this.decode_mode_prob_models(bc); 
			br.decode_mv_models(bc, this.models.mv_models);
		}
		br.decode_coeff_models(bc, this.models, hdr.is_intra);
		if (hdr.use_huffman) {
			throw new Error("UnimplementedDecoding use_huffman");
		}
		if (hdr.interlaced) {
			this.ilace_prob = asU8(bc.read_bits(8));
		}
		this.fstate = new FrameState();
		this.fstate.dc_quant = asI16(VP56_DC_QUANTS[hdr.quant] * 4);
		this.fstate.ac_quant = asI16(VP56_AC_QUANTS[hdr.quant] * 4);
		this.loop_thr = asI16(VP56_FILTER_LIMITS[hdr.quant]);
	 
		this.last_mbt = new VPMBType(VPMBType.InterNoMV);

		for (var i = 0; i < this.top_ctx.length; i++) {
			var vec = this.top_ctx[i];
			vec.fill(0);
		}

		this.last_dc = [new Int16Array(4), new Int16Array(4), new Int16Array(4)];
		this.last_dc[0][1] = 0x80;
		this.last_dc[0][2] = 0x80;
		this.dc_pred.reset();
		
		this.ilace_mb = false;
		for (var mb_y = 0; mb_y < this.mb_h; mb_y++) {
			this.fstate.mb_y = mb_y;
			this.fstate.coeff_cat[0].fill(0);
			this.fstate.coeff_cat[1].fill(0);
			this.fstate.coeff_cat[2].fill(0);
			this.fstate.coeff_cat[3].fill(0);
			this.fstate.last_idx.fill(24);
			for (var mb_x = 0; mb_x < this.mb_w; mb_x++) {
				this.fstate.mb_x = mb_x;
				this.decode_mb(dframe, bc, cr, br, hdr, alpha);
				this.dc_pred.next_mb();
			}
			this.dc_pred.update_row();
		}
	}
	VP56Decoder.prototype.decode_mode_prob_models = function(bc) {
		let mb_y = this.fstate.mb_y;
		for (let ctx = 0; ctx < 3; ctx++) {
			if (bc.read_prob(174)) {
				let idx = bc.read_bits(4);
				for (let i = 0; i < 20; i++) {
					this.models.prob_xmitted[ctx][i ^ 1] = VP56_MODE_VQ[ctx][idx][i];
				}
			}
			if (bc.read_prob(254)) {
				for (let set = 0; set < 20; set++) {
					if (bc.read_prob(205)) {
						let sign = bc.read_bool();
						let diff = (bc.read_prob(171) ? (bc.read_prob(199) ? bc.read_bits(7) : (bc.read_prob(140) ? 3 : (bc.read_prob(125) ? 4 : (bc.read_prob(104) ? 5 : 6)))) : (bc.read_prob(83) ? 1 : 2)) * 4;
						validate(diff < 256);
						let _diff = asU8(diff);
						if (!sign) {
							validate(this.models.prob_xmitted[ctx][set ^ 1] <= 255 - _diff);
							this.models.prob_xmitted[ctx][set ^ 1] += _diff;
						} else {
							validate(this.models.prob_xmitted[ctx][set ^ 1] >= _diff);
							this.models.prob_xmitted[ctx][set ^ 1] -= _diff;
						}
					}
				}
			}
		}
		for (let ctx = 0; ctx < 3; ctx++) {
			let prob_xmitted = this.models.prob_xmitted[ctx];
			for (let mode = 0; mode < 10; mode++) {
				let mdl = this.models.mbtype_models[ctx][mode];
				let cnt = new Uint32Array(10);
				let total = 0;
				for (let i = 0; i < 10; i++) {
					if (i == mode) continue; 
					cnt[i] = 100 * asU32(prob_xmitted[i * 2]);
					total += cnt[i];
				}
				let sum = asU32(prob_xmitted[mode * 2]) + asU32(prob_xmitted[mode * 2 + 1]);
				mdl.probs[9] = 255 - rescale_mb_mode_prob(asU32(prob_xmitted[mode * 2 + 1]), sum);
				let inter_mv0_weight = cnt[0] + cnt[2];
				let inter_mv1_weight = cnt[3] + cnt[4];
				let gold_mv0_weight = cnt[5] + cnt[6];
				let gold_mv1_weight = cnt[8] + cnt[9];
				let mix_weight = cnt[1] + cnt[7];
				mdl.probs[0] = 1 + rescale_mb_mode_prob(inter_mv0_weight + inter_mv1_weight, total);
				mdl.probs[1] = 1 + rescale_mb_mode_prob(inter_mv0_weight, inter_mv0_weight + inter_mv1_weight);
				mdl.probs[2] = 1 + rescale_mb_mode_prob(mix_weight, mix_weight + gold_mv0_weight + gold_mv1_weight);
				mdl.probs[3] = 1 + rescale_mb_mode_prob(cnt[0], inter_mv0_weight);
				mdl.probs[4] = 1 + rescale_mb_mode_prob(cnt[3], inter_mv1_weight);
				mdl.probs[5] = 1 + rescale_mb_mode_prob(cnt[1], mix_weight);
				mdl.probs[6] = 1 + rescale_mb_mode_prob(gold_mv0_weight, gold_mv0_weight + gold_mv1_weight);
				mdl.probs[7] = 1 + rescale_mb_mode_prob(cnt[5], gold_mv0_weight);
				mdl.probs[8] = 1 + rescale_mb_mode_prob(cnt[8], gold_mv1_weight);    
			}
		}
	}
	VP56Decoder.prototype.find_mv_pred = function(ref_id) {
		const CAND_POS = [
			new Int8Array([-1,  0]), new Int8Array([ 0, -1]),
			new Int8Array([-1, -1]), new Int8Array([-1,  1]),
			new Int8Array([-2,  0]), new Int8Array([ 0, -2]),
			new Int8Array([-1, -2]), new Int8Array([-2, -1]),
			new Int8Array([-2,  1]), new Int8Array([-1,  2]),
			new Int8Array([-2, -2]), new Int8Array([-2,  2])
		]; 
		let nearest_mv = ZERO_MV;
		let near_mv = ZERO_MV;
		let pred_mv = ZERO_MV;
		let num_mv = 0;
		for (let i = 0; i < CAND_POS.length; i++) {
			let [yoff, xoff] = CAND_POS[i];
			let cx = (this.fstate.mb_x) + xoff;
			let cy = (this.fstate.mb_y) + yoff;
			if ((cx < 0) || (cy < 0)) {
				continue;
			}
			if ((cx >= this.mb_w) || (cy >= this.mb_h)) {
				continue;
			}
			let mb_pos = cx + cy * this.mb_w;
			let mv = this.mb_info[mb_pos].mv;
			if ((this.mb_info[mb_pos].mb_type.get_ref_id() != ref_id) || mv.eq(ZERO_MV)) {
				continue;
			}
			if (num_mv == 0) {
				nearest_mv = mv;
				num_mv += 1;
				if ((this.version > 5) && (i < 2)) {
					pred_mv = mv;
				}
			} else if (!(mv.eq(nearest_mv))) {
				near_mv = mv;
				num_mv += 1;
				break;
			}
		}
		return [num_mv, nearest_mv, near_mv, pred_mv];
	}
	VP56Decoder.prototype.decode_mb_type = function(bc, ctx) {
		let probs = this.models.mbtype_models[ctx][map_mb_type(this.last_mbt)].probs;
		if (!bc.read_prob(probs[9])) {
			this.last_mbt = bc.read_prob(probs[0]) ? (bc.read_prob(probs[2]) ? (bc.read_prob(probs[6]) ? (bc.read_prob(probs[8]) ? new VPMBType(VPMBType.GoldenNear) : new VPMBType(VPMBType.GoldenNearest)) : (bc.read_prob(probs[7]) ? new VPMBType(VPMBType.GoldenMV) : new VPMBType(VPMBType.GoldenNoMV))) : (bc.read_prob(probs[5]) ? new VPMBType(VPMBType.InterFourMV) : new VPMBType(VPMBType.Intra))) : (bc.read_prob(probs[1]) ? (bc.read_prob(probs[4]) ? new VPMBType(VPMBType.InterNear) : new VPMBType(VPMBType.InterNearest)) : (bc.read_prob(probs[3]) ? new VPMBType(VPMBType.InterMV) : new VPMBType(VPMBType.InterNoMV)));
		}
		return this.last_mbt;
	}
	VP56Decoder.prototype.decode_mb = function(frm, bc, cr, br, hdr, alpha) { // decode macroblock
		const FOURMV_SUB_TYPE = [
			new VPMBType(VPMBType.InterNoMV),
			new VPMBType(VPMBType.InterMV),
			new VPMBType(VPMBType.InterNearest),
			new VPMBType(VPMBType.InterNear)
		];
		let mb_x = this.fstate.mb_x;
		let mb_y = this.fstate.mb_y;
		this.coeffs[0].fill(0);
		this.coeffs[1].fill(0);
		this.coeffs[2].fill(0);
		this.coeffs[3].fill(0);
		this.coeffs[4].fill(0);
		this.coeffs[5].fill(0);
		let mb_pos = mb_x + mb_y * this.mb_w;
		let four_mv = [ZERO_MV, ZERO_MV, ZERO_MV, ZERO_MV];
		let four_mbt = [new VPMBType(VPMBType.Intra), new VPMBType(VPMBType.Intra), new VPMBType(VPMBType.Intra), new VPMBType(VPMBType.Intra)];
		if (hdr.interlaced) {
			let iprob = this.ilace_prob;
			let prob;
			if (mb_x == 0) {
				prob = iprob;
			} else if (!this.ilace_mb) {
				prob = asU8(iprob + asU8(((256 - asU16(iprob)) >> 1)));
			} else {
				prob = asU8(iprob - (iprob >> 1));
			};
			this.ilace_mb = bc.read_prob(prob);
		}
		let num_mv;
		let nearest_mv;
		let near_mv;
		let pred_mv;
		if (hdr.is_intra) {
			num_mv = 0;
			nearest_mv = ZERO_MV;
			near_mv = ZERO_MV;
			pred_mv = ZERO_MV;
		} else {
			var ggdfd = this.find_mv_pred(VP_REF_INTER);
			num_mv = ggdfd[0];
			nearest_mv = ggdfd[1];
			near_mv = ggdfd[2];
			pred_mv = ggdfd[3];
		}
		let mb_type;
		if (hdr.is_intra) {
			mb_type = new VPMBType(VPMBType.Intra);
		} else {
			mb_type = this.decode_mb_type(bc, (num_mv + 1) % 3);
		}
		this.mb_info[mb_pos].mb_type = mb_type;
		if (mb_type.get_ref_id() != VP_REF_GOLDEN) {
			switch(mb_type.type) {
				case VPMBType.Intra:
				case VPMBType.InterNoMV:
					this.mb_info[mb_pos].mv = ZERO_MV;
					break;
				case VPMBType.InterMV:
					let diff_mv = this.decode_mv(bc, br);
					this.mb_info[mb_pos].mv = pred_mv.add(diff_mv);
					break;
				case VPMBType.InterNearest:
					this.mb_info[mb_pos].mv = nearest_mv;
					break;
				case VPMBType.InterNear:
					this.mb_info[mb_pos].mv = near_mv;
					break;
				case VPMBType.InterFourMV:
					for (var i = 0; i < 4; i++) {
						four_mbt[i] = FOURMV_SUB_TYPE[bc.read_bits(2)];
					}
					for (var i = 0; i < 4; i++) {
						switch(four_mbt[i].type) {
							case VPMBType.InterNoMV:
								break;
							case VPMBType.InterMV:
								let diff_mv = this.decode_mv(bc, br);
								four_mv[i] = pred_mv.add(diff_mv);
								break;
							case VPMBType.InterNearest:
								four_mv[i] = nearest_mv;
								break;
							case VPMBType.InterNear:
								four_mv[i] = near_mv;
								break;
							default:
								throw new Error("unreachable");
						}
					}
					this.mb_info[mb_pos].mv = four_mv[3];
					break;
				default:
					throw new Error("unreachable");
			}
		} else {
			let [_num_mv, nearest_mv, near_mv, pred_mv] = this.find_mv_pred(VP_REF_GOLDEN);
			switch(mb_type.type) {
				case VPMBType.GoldenNoMV:
					this.mb_info[mb_pos].mv = ZERO_MV;
					break;
				case VPMBType.GoldenMV:
					let diff_mv = this.decode_mv(bc, br);
					this.mb_info[mb_pos].mv = pred_mv.add(diff_mv);
					break;
				case VPMBType.GoldenNearest:
					this.mb_info[mb_pos].mv = nearest_mv;
					break;
				case VPMBType.GoldenNear:
					this.mb_info[mb_pos].mv = near_mv;
					break;
			}
		}
		if (!mb_type.is_intra() && (mb_type.type != VPMBType.InterFourMV)) {
			this.do_mc(br, frm, mb_type, this.mb_info[mb_pos].mv, alpha);
		} else if (mb_type.type == VPMBType.InterFourMV) {
			this.do_fourmv(br, frm, four_mv, alpha);
		}
		for (var blk_no = 0; blk_no < 4; blk_no++) {
			this.fstate.plane = (!alpha ? 0 : 3);
			this.fstate.ctx_idx = blk_no >> 1;
			this.fstate.top_ctx = this.top_ctx[this.fstate.plane][mb_x * 2 + (blk_no & 1)];
			switch(cr.type) {
				case CoeffReader.None:
					br.decode_block(bc, this.coeffs[blk_no], this.models.coeff_models[0], this.models.vp6models, this.fstate);
					break;
				case CoeffReader.Bool:
					br.decode_block(cr.value, this.coeffs[blk_no], this.models.coeff_models[0], this.models.vp6models, this.fstate);
					break;
			}
			this.top_ctx[this.fstate.plane][mb_x * 2 + (blk_no & 1)] = this.fstate.top_ctx;
			this.predict_dc(mb_type, mb_pos, blk_no, alpha);
			let bx = mb_x * 2 + (blk_no & 1);
			let by = mb_y * 2 + (blk_no >> 1);
			let has_ac = (this.fstate.last_idx[this.fstate.ctx_idx] > 0);
			if (mb_type.is_intra()) {
				if (!this.ilace_mb) {
					if (has_ac) {
						vp_put_block(this.coeffs[blk_no], bx, by, this.fstate.plane, frm);
					} else {
						vp_put_block_dc(this.coeffs[blk_no], bx, by, this.fstate.plane, frm);
					}
				} else {
					vp_put_block_ilace(this.coeffs[blk_no], bx, by, this.fstate.plane, frm);
				}
			} else {
				if (!this.ilace_mb) {
					if (has_ac) {
						vp_add_block(this.coeffs[blk_no], bx, by, this.fstate.plane, frm);
					} else {
						vp_add_block_dc(this.coeffs[blk_no], bx, by, this.fstate.plane, frm);
					}
				} else {
					vp_add_block_ilace(this.coeffs[blk_no], bx, by, this.fstate.plane, frm);
				}
			}
		}
		for (var blk_no = 4; blk_no < 6; blk_no++) {
			this.fstate.plane = blk_no - 3;
			this.fstate.ctx_idx = blk_no - 2;
			this.fstate.top_ctx = this.top_ctx[this.fstate.plane][mb_x];
			switch(cr.type) {
				case CoeffReader.None:
					br.decode_block(bc, this.coeffs[blk_no], this.models.coeff_models[1], this.models.vp6models, this.fstate);
					break;
				case CoeffReader.Bool:
					br.decode_block(cr.value, this.coeffs[blk_no], this.models.coeff_models[1], this.models.vp6models, this.fstate);
					break;
			}
			this.top_ctx[this.fstate.plane][mb_x] = this.fstate.top_ctx;
			this.predict_dc(mb_type, mb_pos, blk_no, alpha);
			if (!alpha) {
				let has_ac = this.fstate.last_idx[this.fstate.ctx_idx] > 0;
				if (mb_type.is_intra()) {
					if (has_ac) {
						vp_put_block(this.coeffs[blk_no], mb_x, mb_y, this.fstate.plane, frm);
					} else {
						vp_put_block_dc(this.coeffs[blk_no], mb_x, mb_y, this.fstate.plane, frm);
					}
				} else {
					if (has_ac) {
						vp_add_block(this.coeffs[blk_no], mb_x, mb_y, this.fstate.plane, frm);
					} else {
						vp_add_block_dc(this.coeffs[blk_no], mb_x, mb_y, this.fstate.plane, frm);
					}
				}
			}
		}
	}
	VP56Decoder.prototype.do_mc = function(br, frm, mb_type, mv, alpha) {
		let x = this.fstate.mb_x * 16;
		let y = this.fstate.mb_y * 16;
		let plane = ((!alpha) ? 0 : 3);
		let src;
		if (mb_type.get_ref_id() == VP_REF_INTER) {
			src = this.shuf.get_last();
		} else {
			src = this.shuf.get_golden();
		};
		br.mc_block(frm, this.mc_buf, src, plane, x + 0, y + 0, mv, this.loop_thr);
		br.mc_block(frm, this.mc_buf, src, plane, x + 8, y + 0, mv, this.loop_thr);
		br.mc_block(frm, this.mc_buf, src, plane, x + 0, y + 8, mv, this.loop_thr);
		br.mc_block(frm, this.mc_buf, src, plane, x + 8, y + 8, mv, this.loop_thr);
		if (!alpha) {
			let x = this.fstate.mb_x * 8;
			let y = this.fstate.mb_y * 8;
			br.mc_block(frm, this.mc_buf, src, 1, x, y, mv, this.loop_thr);
			br.mc_block(frm, this.mc_buf, src, 2, x, y, mv, this.loop_thr);
		}
	}
	VP56Decoder.prototype.do_fourmv = function(br, frm, mvs, alpha) {
		let x = this.fstate.mb_x * 16;
		let y = this.fstate.mb_y * 16;
		let plane;
		if (!alpha) {
			plane = 0;
		} else {
			plane = 3;
		};
		let src = this.shuf.get_last();
		for (let blk_no = 0; blk_no < 4; blk_no++) {
			br.mc_block(frm, this.mc_buf, src, plane, x + (blk_no & 1) * 8, y + (blk_no & 2) * 4, mvs[blk_no], this.loop_thr);
		}
		if (!alpha) {
			let x = this.fstate.mb_x * 8;
			let y = this.fstate.mb_y * 8;
			let sum = mvs[0].add(mvs[1].add(mvs[2].add(mvs[3])));
			let mv = new MV(asI16(sum.x / 4), asI16(sum.y / 4));
			br.mc_block(frm, this.mc_buf, src, 1, x, y, mv, this.loop_thr);
			br.mc_block(frm, this.mc_buf, src, 2, x, y, mv, this.loop_thr);
		}
	}
	VP56Decoder.prototype.decode_mv = function(bc, br) {
		let x = br.decode_mv(bc, this.models.mv_models[0]);
		let y = br.decode_mv(bc, this.models.mv_models[1]);
		return new MV(x, y);
	}
	VP56Decoder.prototype.predict_dc = function(mb_type, _mb_pos, blk_no, _alpha) {
		let is_luma = blk_no < 4;
		let plane;
		let dcs;
		switch(blk_no) {
			case 4:
				plane = 1;
				dcs = this.dc_pred.dc_u;
				break;
			case 5:
				plane = 2;
				dcs = this.dc_pred.dc_v;
				break;
			default:
				plane = 0;
				dcs = this.dc_pred.dc_y;
		}
		let dc_ref;
		let dc_idx;
		if (is_luma) {
			dc_ref = this.dc_pred.ref_y;
			dc_idx = this.dc_pred.y_idx + (blk_no & 1);
		} else {
			dc_ref = this.dc_pred.ref_c;
			dc_idx = this.dc_pred.c_idx;
		}
		let ref_id = mb_type.get_ref_id();
		let dc_pred = 0;
		let count = 0;
		let has_left_blk = is_luma && ((blk_no & 1) == 1);
		if (has_left_blk || this.dc_pred.ref_left == ref_id) {
			var _ = 0;
			switch(blk_no) {
				case 0:
				case 1:
					_ = this.dc_pred.ldc_y[0];
					break;
				case 2:
				case 3:
					_ = this.dc_pred.ldc_y[1];
					break;
				case 4:
					_ = this.dc_pred.ldc_u;
					break;
				default:
					_ = this.dc_pred.ldc_v;
			}
			dc_pred += _;
			count += 1;
		}
		if (dc_ref[dc_idx] == ref_id) {
			dc_pred += dcs[dc_idx];
			count += 1;
		}
		if (this.version == 5) {
			if ((count < 2) && (dc_ref[dc_idx - 1] == ref_id)) {
				dc_pred += dcs[dc_idx - 1];
				count += 1;
			}
			if ((count < 2) && (dc_ref[dc_idx + 1] == ref_id)) {
				dc_pred += dcs[dc_idx + 1];
				count += 1;
			}
		}
		if (count == 0) {
			dc_pred = this.last_dc[ref_id][plane];
		} else if (count == 2) {
			dc_pred /= 2;
			dc_pred = asI16(dc_pred);
		}
		this.coeffs[blk_no][0] += dc_pred;
		let dc = this.coeffs[blk_no][0];
		if (blk_no != 4) { // update top block reference only for the second chroma component
			dc_ref[dc_idx] = ref_id;
		}
		switch(blk_no) {
			case 0:
			case 1:
				this.dc_pred.ldc_y[0] = dc;
				break;
			case 2:
			case 3:
				this.dc_pred.ldc_y[1] = dc;
				break;
			case 4:
				this.dc_pred.ldc_u = dc;
				break;
			default:
				this.dc_pred.ldc_v = dc;
				this.dc_pred.ref_left = ref_id;
		}
		dcs[dc_idx] = dc;
		this.last_dc[ref_id][plane] = dc;
		this.coeffs[blk_no][0] = wrapping_mul_i16(this.coeffs[blk_no][0], this.fstate.dc_quant);
	}

	//// vp6 ////

	const TOKEN_LARGE = 5;
	const TOKEN_EOB = 42;

	function update_scan(model) {
		let idx = 1;
		for (var band = 0; band < 16; band++) {
			for (var i = 1; i < 64; i++) {
				if (model.scan_order[i] == band) {
					model.scan[idx] = i;
					idx += 1;
				}
			}
		}
		for (var i = 1; i < 64; i++) {
			model.zigzag[i] = ZIGZAG[model.scan[i]];
		}
	}

	function reset_scan(model, interlaced) {
		if (!interlaced) {
			model.scan_order.set(VP6_DEFAULT_SCAN_ORDER, 0);
		} else {
			model.scan_order.set(VP6_INTERLACED_SCAN_ORDER, 0);
		}
		for (var i = 0; i < 64; i++) {
			model.scan[i] = i;
		}
		model.zigzag.set(ZIGZAG, 0);
	}

	function expand_token_bc(bc, val_probs, token, version) { // i16
		let sign = false;
		let level;
		if (token < TOKEN_LARGE) {
			if (token != 0) {
				sign = bc.read_bool();
			}
			level = asI16(token);
		} else {
			let cat = bc.read_prob(val_probs[6]) ? (bc.read_prob(val_probs[8]) ? (bc.read_prob(val_probs[10]) ? 5 : 4) : (bc.read_prob(val_probs[9]) ? 3 : 2)) : (bc.read_prob(val_probs[7]) ? 1 : 0);
			if (version == 5) {
				sign = bc.read_bool();
			}
			let add = 0; // i16
			let add_probs = VP56_COEF_ADD_PROBS[cat];
			for (var i = 0; i < add_probs.length; i++) {
				var prob = add_probs[i];
				if (prob == 128) {
					break;
				}
				add = (add << 1) | asI16(bc.read_prob(prob));
			}
			if (version != 5) {
				sign = bc.read_bool();
			}
			level = asI16(VP56_COEF_BASE[cat] + asI16(add));
		}
		if (!sign) {
			return asI16(level);
		} else {
			return asI16(-level);
		}
	}

	function decode_token_bc(bc, probs, prob34, is_dc, has_nnz) {
		if (has_nnz && !bc.read_prob(probs[0])) {
			if (is_dc || bc.read_prob(probs[1])) {
				return 0;
			} else {
				return TOKEN_EOB;
			}
		} else {
			return asU8(bc.read_prob(probs[2]) ? (bc.read_prob(probs[3]) ? TOKEN_LARGE : (bc.read_prob(probs[4]) ? (bc.read_prob(prob34) ? 4 : 3) : 2)) : 1);
		}
	}

	function decode_zero_run_bc(bc, probs) {
		let val = bc.read_prob(probs[0]) ? (bc.read_prob(probs[4]) ? 42 : (bc.read_prob(probs[5]) ? (bc.read_prob(probs[7]) ? 7 : 6) : (bc.read_prob(probs[6]) ? 5 : 4))) : (bc.read_prob(probs[1]) ? (bc.read_prob(probs[3]) ? 3 : 2) : (bc.read_prob(probs[2]) ? 1 : 0));
		if (val != 42) {
			return val;
		} else {
			let nval = 8;
			for (var i = 0; i < 6; i++) {
				nval += (bc.read_prob(probs[i + 8])) << i;
			}
			return nval;
		}
	}

	function get_block(dst, dstride, src, comp, dx, dy, mv_x, mv_y) {
		let [w, h] = src.get_dimensions(comp);
		let sx = dx + mv_x;
		let sy = dy + mv_y;
		if ((sx - 2 < 0) || (sx + 8 + 2 > (w)) || (sy - 2 < 0) || (sy + 8 + 2 > (h))) {
			edge_emu(src, sx - 2, sy - 2, 8 + 2 + 2, 8 + 2 + 2, dst, dstride, comp, 0);
		} else {
			let sstride = src.get_stride(comp);
			let soff    = src.get_offset(comp);
			let sdta    = src.get_data();
			let sbuf = sdta;
			let saddr = soff + ((sx - 2)) + ((sy - 2)) * sstride;
			var _t = 12;
			let a = 0;
			let b = 0;
			while(_t--) {
				dst[a + 0] = sbuf[(saddr + b) + 0];
				dst[a + 1] = sbuf[(saddr + b) + 1];
				dst[a + 2] = sbuf[(saddr + b) + 2];
				dst[a + 3] = sbuf[(saddr + b) + 3];
				dst[a + 4] = sbuf[(saddr + b) + 4];
				dst[a + 5] = sbuf[(saddr + b) + 5];
				dst[a + 6] = sbuf[(saddr + b) + 6];
				dst[a + 7] = sbuf[(saddr + b) + 7];
				dst[a + 8] = sbuf[(saddr + b) + 8];
				dst[a + 9] = sbuf[(saddr + b) + 9];
				dst[a + 10] = sbuf[(saddr + b) + 10];
				dst[a + 11] = sbuf[(saddr + b) + 11];
				a += dstride;
				b += sstride;
			}
		}
	}

	function calc_variance(var_off, src, stride) {
		let sum = 0;
		let ssum = 0;
		let j = 0;
		for (let _ = 0; _ < 4; _++) {
			for (let a = 0; a < 4; a++) {
				let el = src[(var_off + j) + (a * 2)];
				let pix = asU32(el);
				sum += pix;
				ssum += pix * pix;
			}
			j += stride * 2;
		}
		return asU16((ssum * 16 - sum * sum) >> 8);
	}

	function mc_filter_bilinear(a, b, c) {
		return asU8((asU16(a) * (8 - c) + asU16(b) * c + 4) >> 3);
	}

	function mc_bilinear(dst_offest, dst, dstride, src, soff, sstride, mx, my) {
		if (my == 0) {
			var dline_offest = 0;
			for (let _ = 0; _ < 8; _++) {
				for (let i = 0; i < 8; i++) {
					dst[(dst_offest + dline_offest) + i] = mc_filter_bilinear(src[soff + i], src[soff + i + 1], mx);
				}
				soff += sstride;
				dline_offest += dstride;
			}
		} else if (mx == 0) {
			var dline_offest = 0;
			for (let _ = 0; _ < 8; _++) {
				for (let i = 0; i < 8; i++) {
					dst[(dst_offest + dline_offest) + i] = mc_filter_bilinear(src[soff + i], src[soff + i + sstride], my);
				}
				soff += sstride;
				dline_offest += dstride;
			}
		} else {
			let tmp = new Uint8Array(8);
			for (let i = 0; i < 8; i++) {
				tmp[i] = mc_filter_bilinear(src[soff + i], src[soff + i + 1], mx);
			}
			soff += sstride;
			var dline_offest = 0;
			for (let _ = 0; _ < 8; _++) {
				for (let i = 0; i < 8; i++) {
					let cur = mc_filter_bilinear(src[soff + i], src[soff + i + 1], mx);
					dst[(dst_offest + dline_offest) + i] = mc_filter_bilinear(tmp[i], cur, my);
					tmp[i] = cur;
				}
				soff += sstride;
				dline_offest += dstride;
			}
		}
	}

	function mc_filter_bicubic($src, $off, $step, $coeffs) {
		return asU8(Math.max(Math.min(((asI32($src[$off - $step]) * asI32($coeffs[0]) + asI32($src[$off]) * asI32($coeffs[1]) + asI32($src[$off + $step]) * asI32($coeffs[2]) + asI32($src[$off + $step * 2]) * asI32($coeffs[3]) + 64) >> 7), 255), 0));
	}

	function mc_bicubic(dst_offest, dst, dstride, src, soff, sstride, coeffs_w, coeffs_h) {
		if (coeffs_h[1] == 128) {
			var dline_offest = 0;
			for (let _ = 0; _ < 8; _++) {
				for (let i = 0; i < 8; i++) {
					dst[(dst_offest + dline_offest) + i] = mc_filter_bicubic(src, soff + i, 1, coeffs_w);
				}
				soff += sstride;
				dline_offest += dstride;
			}
		} else if (coeffs_w[1] == 128) { // horizontal-only interpolation
			var dline_offest = 0;
			for (let _ = 0; _ < 8; _++) {
				for (let i = 0; i < 8; i++) {
					dst[(dst_offest + dline_offest) + i] = mc_filter_bicubic(src, soff + i, sstride, coeffs_h);
				}
				soff += sstride;
				dline_offest += dstride;
			}
		} else {
			let buf = new Uint8Array(16 * 11);
			let a = 0;
			soff -= sstride;
			for (let _ = 0; _ < 11; _++) {
				for (let i = 0; i < 8; i++) {
					buf[a + i] = mc_filter_bicubic(src, soff + i, 1, coeffs_w);
				}
				soff += sstride;
				a += 16;
			}
			let _soff = 16;
			a = 0;
			for (let _ = 0; _ < 8; _++) {
				for (let i = 0; i < 8; i++) {
					dst[(dst_offest + a) + i] = mc_filter_bicubic(buf, _soff + i, 16, coeffs_h);
				}
				_soff += 16;
				a += dstride;
			}
		}
	}

	const VP6BR = function() {
		this.vpversion = 0;
		this.profile = 0;
		this.interlaced = false;
		this.do_pm = false;
		this.loop_mode = 0;
		this.autosel_pm = false;
		this.var_thresh = 0;
		this.mv_thresh = 0;
		this.bicubic = false;
		this.filter_alpha = 0;
	}
	VP6BR.prototype.parseHeader = function(bc) {
		let hdr = new VP56Header();
		let src = bc.src;
		let br = new Bits(src);
		hdr.is_intra = !br.read_bool();
		hdr.is_golden = hdr.is_intra;
		hdr.quant = br.read(6);
		hdr.multistream = br.read_bool();
		if (hdr.is_intra) {
			hdr.version = br.read(5);
			validate((hdr.version >= VERSION_VP60) && (hdr.version <= VERSION_VP62));
			hdr.profile = br.read(2);
			validate((hdr.profile == VP6_SIMPLE_PROFILE) || (hdr.profile == VP6_ADVANCED_PROFILE));
			hdr.interlaced = br.read_bool();
		} else {
			hdr.version = this.vpversion;
			hdr.profile = this.profile;
			hdr.interlaced = this.interlaced;
		}
		if (hdr.multistream || (hdr.profile == VP6_SIMPLE_PROFILE)) {
			hdr.offset = br.read(16);
			validate(hdr.offset > (hdr.is_intra ? 6 : 2));
			hdr.multistream = true;
		}
		let bytes = br.tell() >> 3;
		bc.skip_bytes(bytes);
		this.loop_mode = 0;
		if (hdr.is_intra) {
			hdr.mb_h = asU8(bc.read_bits(8));
			hdr.mb_w = asU8(bc.read_bits(8));
			hdr.disp_h = asU8(bc.read_bits(8));
			hdr.disp_w = asU8(bc.read_bits(8));
			validate((hdr.mb_h > 0) && (hdr.mb_w > 0));
			hdr.scale = bc.read_bits(2);
		} else {
			hdr.is_golden = bc.read_bool();
			if (hdr.profile == VP6_ADVANCED_PROFILE) {
				this.loop_mode = +bc.read_bool();
				if (this.loop_mode != 0) {
					this.loop_mode += +bc.read_bool();
					validate(this.loop_mode <= 1);
				}
				if (hdr.version == VERSION_VP62) {
					this.do_pm = bc.read_bool();
				}
			}
		}
		if ((hdr.profile == VP6_ADVANCED_PROFILE) && (hdr.is_intra || this.do_pm)) {
			this.autosel_pm = bc.read_bool();
			if (this.autosel_pm) {
				this.var_thresh = bc.read_bits(5);
				if (hdr.version != VERSION_VP62) {
					this.var_thresh <<= 5;
				}
				this.mv_thresh = bc.read_bits(3);
			} else {
				this.bicubic = bc.read_bool();
			}
			if (hdr.version == VERSION_VP62) {
				this.filter_alpha = bc.read_bits(4);
			} else {
				this.filter_alpha = 16;
			}
		}
		hdr.use_huffman = bc.read_bool();
		this.vpversion = hdr.version;
		this.profile = hdr.profile;
		this.interlaced = hdr.interlaced;
		return hdr;
	}
	VP6BR.prototype.decode_mv = function(bc, model) {
		let val;
		if (!bc.read_prob(model.nz_prob)) {
			val = bc.read_prob(model.tree_probs[0]) ? (bc.read_prob(model.tree_probs[4]) ? (bc.read_prob(model.tree_probs[6]) ? 7 : 6) : (bc.read_prob(model.tree_probs[5]) ? 5 : 4)) : (bc.read_prob(model.tree_probs[1]) ? (bc.read_prob(model.tree_probs[3]) ? 3 : 2) : (bc.read_prob(model.tree_probs[2]) ? 1 : 0));
		} else {
			let raw = 0;
			for (var i = 0; i < LONG_VECTOR_ORDER.length; i++) {
				var ord = LONG_VECTOR_ORDER[i];
				raw |= asI16(bc.read_prob(model.raw_probs[ord])) << ord;
			}
			if ((raw & 0xF0) != 0) {
				raw |= asI16(bc.read_prob(model.raw_probs[3])) << 3;
			} else {
				raw |= 1 << 3;
			}
			val = asI16(raw);
		}
		if ((val != 0) && bc.read_prob(model.sign_prob)) {
			return -val;
		} else {
			return val;
		}
	}
	
	VP6BR.prototype.reset_models = function(models) {
		for (var i = 0; i < models.mv_models.length; i++) {
			var mdl = models.mv_models[i];
			mdl.nz_prob = NZ_PROBS[i];
			mdl.sign_prob = 128;
			mdl.raw_probs.set(RAW_PROBS[i], 0);
			mdl.tree_probs.set(TREE_PROBS[i], 0);
		}
		models.vp6models.zero_run_probs[0].set(ZERO_RUN_PROBS[0], 0);
		models.vp6models.zero_run_probs[1].set(ZERO_RUN_PROBS[1], 0);
		reset_scan(models.vp6models, this.interlaced);
	}
	VP6BR.prototype.decode_mv_models = function(bc, models) {
		for (let comp = 0; comp < 2; comp++) {
			if (bc.read_prob(HAS_NZ_PROB[comp])) {
				models[comp].nz_prob = bc.read_probability();
			}
			if (bc.read_prob(HAS_SIGN_PROB[comp])) {
				models[comp].sign_prob = bc.read_probability();
			}
		}
		for (let comp = 0; comp < 2; comp++) {
			for (let i = 0; i < HAS_TREE_PROB[comp].length; i++) {
				const prob = HAS_TREE_PROB[comp][i];
				if (bc.read_prob(prob)) {
					models[comp].tree_probs[i] = bc.read_probability();
				}
			}
		}
		for (let comp = 0; comp < 2; comp++) {
			for (let i = 0; i < HAS_RAW_PROB[comp].length; i++) {
				const prob = HAS_RAW_PROB[comp][i];
				if (bc.read_prob(prob)) {
					models[comp].raw_probs[i] = bc.read_probability();
				}
			}
		}
	}
	VP6BR.prototype.decode_coeff_models = function(bc, models, is_intra) {
		let def_prob = new Uint8Array(11);
		def_prob.fill(128);
		for (var plane = 0; plane < 2; plane++) {
			for (var i = 0; i < 11; i++) {
				if (bc.read_prob(HAS_COEF_PROBS[plane][i])) {
					def_prob[i] = bc.read_probability();
					models.coeff_models[plane].dc_value_probs[i] = def_prob[i];
				} else if (is_intra) {
					models.coeff_models[plane].dc_value_probs[i] = def_prob[i];
				}
			}
		}
		if (bc.read_bool()) {
			for (var i = 1; i < 64; i++) {
				if (bc.read_prob(HAS_SCAN_UPD_PROBS[i])) {
					models.vp6models.scan_order[i] = bc.read_bits(4);
				}
			}
			update_scan(models.vp6models);
		} else {
			reset_scan(models.vp6models, this.interlaced);
		}
		for (var comp = 0; comp < 2; comp++) {
			for (var i = 0; i < 14; i++) {
				if (bc.read_prob(HAS_ZERO_RUN_PROBS[comp][i])) {
					models.vp6models.zero_run_probs[comp][i] = bc.read_probability();
				}
			}
		}
		for (var ctype = 0; ctype < 3; ctype++) {
			for (var plane = 0; plane < 2; plane++) {
				for (var group = 0; group < 6; group++) {
					for (var i = 0; i < 11; i++) {
						if (bc.read_prob(VP6_AC_PROBS[ctype][plane][group][i])) {
							def_prob[i] = bc.read_probability();
							models.coeff_models[plane].ac_val_probs[ctype][group][i] = def_prob[i];
						} else if (is_intra) {
							models.coeff_models[plane].ac_val_probs[ctype][group][i] = def_prob[i];
						}
					}
				}
			}
		}
		for (var plane = 0; plane < 2; plane++) {
			let mdl = models.coeff_models[plane];
			for (var i = 0; i < 3; i++) {
				for (var k = 0; k < 5; k++) {
					mdl.dc_token_probs[0][i][k] = rescale_prob(mdl.dc_value_probs[k], VP6_DC_WEIGHTS[k][i], 255);
				}
			}
		}
	}
	VP6BR.prototype.decode_block = function(bc, coeffs, model, vp6model, fstate) {
		var left_ctx = fstate.coeff_cat[fstate.ctx_idx][0];
		var top_ctx = fstate.top_ctx;
		var dc_mode = top_ctx + left_ctx;
		var token = decode_token_bc(bc, model.dc_token_probs[0][dc_mode], model.dc_value_probs[5], true, true);
		var val = expand_token_bc(bc, model.dc_value_probs, token, 6);
		coeffs[0] = val;
		fstate.last_idx[fstate.ctx_idx] = 0;
		var idx = 1;
		var last_val = val;
		while (idx < 64) {
			var ac_band = VP6_IDX_TO_AC_BAND[idx];
			var ac_mode = Math.min(Math.abs(last_val), 2);
			var has_nnz = (idx == 1) || (last_val != 0);
			var _token = decode_token_bc(bc, model.ac_val_probs[ac_mode][ac_band], model.ac_val_probs[ac_mode][ac_band][5], false, has_nnz);
			if (_token == 42) break;
			var _val = expand_token_bc(bc, model.ac_val_probs[ac_mode][ac_band], _token, 6);
			coeffs[vp6model.zigzag[idx]] = wrapping_mul_i16(_val, fstate.ac_quant);
			idx += 1;
			last_val = _val;
			if (_val == 0) {
				idx += decode_zero_run_bc(bc, vp6model.zero_run_probs[(idx >= 7) ? 1 : 0]);
				validate(idx <= 64);
			}
		}
		fstate.coeff_cat[fstate.ctx_idx][0] = (coeffs[0] != 0) ? 1 : 0;
		fstate.top_ctx = fstate.coeff_cat[fstate.ctx_idx][0];
		fstate.last_idx[fstate.ctx_idx] = idx;
	}
	VP6BR.prototype.mc_block = function(dst, mc_buf, src, plane, x, y, mv, loop_str) {
		let is_luma = (plane != 1) && (plane != 2);
		let sx, sy, mx, my, msx, msy;
		if (is_luma) {
			sx = mv.x >> 2;
			sy = mv.y >> 2;
			mx = (mv.x & 3) << 1;
			my = (mv.y & 3) << 1;
			msx = asI16(mv.x / 4);
			msy = asI16(mv.y / 4);
		} else {
			sx = mv.x >> 3;
			sy = mv.y >> 3;
			mx = mv.x & 7;
			my = mv.y & 7;
			msx = asI16(mv.x / 8);
			msy = asI16(mv.y / 8);
		}
		let tmp_blk = mc_buf.get_data();
		get_block(tmp_blk, 16, src, plane, x, y, sx, sy);
		if ((msx & 7) != 0) {
			let foff = (8 - (sx & 7));
			let off = 2 + foff;
			vp31_loop_filter(tmp_blk, off, 1, 16, 12, loop_str);
		}
		if ((msy & 7) != 0) {
			let foff = (8 - (sy & 7));
			let off = (2 + foff) * 16;
			vp31_loop_filter(tmp_blk, off, 16, 1, 12, loop_str);
		}
		let copy_mode = (mx == 0) && (my == 0);
		let bicubic = !copy_mode && is_luma && this.bicubic;
		if (is_luma && !copy_mode && (this.profile == VP6_ADVANCED_PROFILE)) {
			if (!this.autosel_pm) {
				bicubic = true;
			} else {
				let mv_limit = 1 << (this.mv_thresh + 1);
				if ((Math.abs(mv.x) <= mv_limit) && (Math.abs(mv.y) <= mv_limit)) {
					let var_off = 16 * 2 + 2;
					if (mv.x < 0) var_off += 1;
					if (mv.y < 0) var_off += 16;
					let _var = calc_variance(var_off, tmp_blk, 16);
					if (_var >= this.var_thresh) {
						bicubic = true;
					}
				}
			}
		}
		let dstride = dst.stride[plane];
		let dbuf = dst.data;
		let dbuf_offest = dst.offset[plane] + x + y * dstride;
		if (copy_mode) {
			let src_offest = 2 * 16 + 2;
			let dline_offest = 0;
			let sline_offest = 0;
			for (let _ = 0; _ < 8; _++) {
				dbuf[(dbuf_offest + dline_offest) + 0] = tmp_blk[(src_offest + sline_offest) + 0];
				dbuf[(dbuf_offest + dline_offest) + 1] = tmp_blk[(src_offest + sline_offest) + 1];
				dbuf[(dbuf_offest + dline_offest) + 2] = tmp_blk[(src_offest + sline_offest) + 2];
				dbuf[(dbuf_offest + dline_offest) + 3] = tmp_blk[(src_offest + sline_offest) + 3];
				dbuf[(dbuf_offest + dline_offest) + 4] = tmp_blk[(src_offest + sline_offest) + 4];
				dbuf[(dbuf_offest + dline_offest) + 5] = tmp_blk[(src_offest + sline_offest) + 5];
				dbuf[(dbuf_offest + dline_offest) + 6] = tmp_blk[(src_offest + sline_offest) + 6];
				dbuf[(dbuf_offest + dline_offest) + 7] = tmp_blk[(src_offest + sline_offest) + 7];
				dline_offest += dst.stride[plane];
				sline_offest += 16;
			}
		} else if (bicubic) {
			let coeff_h = VP6_BICUBIC_COEFFS[this.filter_alpha][mx];
			let coeff_v = VP6_BICUBIC_COEFFS[this.filter_alpha][my];
			mc_bicubic(dbuf_offest, dbuf, dstride, tmp_blk, 16 * 2 + 2, 16, coeff_h, coeff_v);
		} else {
			mc_bilinear(dbuf_offest, dbuf, dstride, tmp_blk, 16 * 2 + 2, 16, mx, my);
		}
	}
	return {
		VP56Decoder,
		VP6BR,
		NADecoderSupport,
		BoolCoder,
		NAVideoInfo,
		YUV420_FORMAT,
		VP_YUVA420_FORMAT
	};
}());