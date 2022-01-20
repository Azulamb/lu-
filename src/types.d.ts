/**
 * WebComponents
 */

interface LuminusWorldElement extends HTMLElement
{
	readonly complete: boolean;
	readonly support: LuminusSupport;
	width: number; height: number;
	top: number; bottom: number; left: number; right: number; near: number; far: number;
	view: 'volume' | 'frustum';
	eyex: number; eyey: number; eyez: number;
	upx: number; upy: number; upz: number;
	centerx: number; centery: number; centerz: number;
	init(): WebGLProgram | null;
	render(): void;
}

interface LuminusModelElement extends HTMLElement
{
	model: LuminusModel;
	readonly complete: boolean;
	readonly support: LuminusSupport | undefined;
	// Translate x
	x: number;
	// Translate y
	y: number;
	// Translate z
	z: number;
	initStyle(): HTMLStyleElement;
	render( support: LuminusSupport ): void;
	rerender(): void;
}

interface LuminusModelAxisElement extends LuminusModelElement
{
	length: number;
}

/**
 * Models
 */

interface LuminusModel
{
	/*
	loaded = complete = undefined
	        Loading has not started.
	loaded = false
	        Now loading or failure.
	loaded = true & complete = undefined
	        Preparation has not started.
	loaded = true & complete = false
	        Now preparation or faiulre.
	loaded = complete = true
	        This model can render.
	*/
	loaded?: boolean;
	complete?: boolean;
	load(): Promise<void>;
	prepare( support: LuminusSupport ): Promise<void>;
	render( support: LuminusSupport ): void;

	afterload?: () => unknown;

	// Overwrite
	onload(): Promise<unknown>;
	onprepare( support: LuminusSupport ): Promise<unknown>;
	onrender( support: LuminusSupport ): void;
}

interface LuminusModelAxis extends LuminusModel
{
	length: number;
}

interface LuminusModelCube extends LuminusModel
{
	color: Float32Array;
}

/**
 * Luminus
 */

interface Matrix
{
	// Init matrix.
	create4(): Float32Array;
	identity4( m?: Float32Array ): Float32Array;
	translation4( x: number, y: number, z: number, m?: Float32Array ): Float32Array;
	scaling4( x: number, y: number, z: number, m?: Float32Array ): Float32Array;
	lookAt( eye: number[], center: number[], up: number[], m?: Float32Array ): Float32Array;
	// calc
	multiply4( a: Float32Array, b: Float32Array, m?: Float32Array ): Float32Array;
}

interface LuminusSupport
{
	gl: WebGL2RenderingContext;
	info: LuminusProgramInfo;
	matrix: Matrix;

	enables( ... enables: number[] ): this;

	init( vertex: string | HTMLScriptElement, fragment: string | HTMLScriptElement ): Promise<WebGLProgram>;

	clear( mask?: number ): this;

	orthographic( left: number, right: number, bottom: number, top: number, near: number, far: number ): Float32Array;
}

interface LuminusProgramInfo
{
	program: WebGLProgram;
	in: { [ keys: string ]: number };
	uniform: { [ keys: string ]: WebGLUniformLocation };

	init(): Promise<void>;

	initShader( vertex: string | HTMLScriptElement, fragment: string | HTMLScriptElement ): void;

	loadShader( element: HTMLScriptElement ): Promise<{ type: number, source: string }>;
	loadShader( type: number, source: string ): Promise<{ type: number, source: string }>;

	createShader( type: number, source: string ): Promise<WebGLShader>;

	loadPosition(): void;
}

interface Luminus
{
	console:
	{
		debug(...data: any[]): void;
		error(...data: any[]): void;
		info(...data: any[]): void;
		log(...data: any[]): void;
		warn(...data: any[]): void;
	};
	loaded: Promise<void>;
	matrix: Matrix;
	model: { new (...params: any[]): LuminusModelElement; };
	models:
	{
		model: { new (...params: any[]): LuminusModel; },
		[ keys: string ]: { new (...params: any[]): LuminusModel; },
	},
	createProgram( support: LuminusSupport ): LuminusProgramInfo;
	createSupport( gl2: WebGL2RenderingContext ): LuminusSupport;
}

declare const Luminus: Luminus;
