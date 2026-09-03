// Single Responsibility Principle
// Contoh Composition

// Repository layer
function getUserByEmail(email: string) {
	return email; // Simulasi pengambilan data user dari database
}

function createUser(userData: { email: string; password: string }) {
	return userData; // Simulasi pembuatan user baru di database
}

// Service layer
function registerUser(email: string, password: string) {
	const existingUser = getUserByEmail(email); // Simulasi pengecekan user yang sudah ada
	if (!existingUser) {
		throw new Error("User already exists");
	}
	const userData = { email, password };
	return createUser(userData);
}

// Repository dikomposisi di dalam layer Service.
// Masing2 fungsi di Repository hanya punya 1 tanggung jawab

// Open Closed Principle
// Contoh penggunaan interface untuk mendukung Open Closed Principle
// Interface untuk mendefinisikan kontrak dari sebuah Shape
// Interface ini bisa diperluas tanpa harus mengubah implementasi yang sudah ada

interface Shape {
	calcArea(): number;
	calcPerimeter(): number;
}

interface Rectangle extends Shape {
	width: number;
	height: number;
}

const rect1: Rectangle = {
	width: 10,
	height: 20,
	calcArea() {
		return this.width * this.height;
	},
	calcPerimeter() {
		return 2 * (this.width + this.height);
	},
};

class Circle implements Shape {
	radius: number;

	constructor(radius: number) {
		this.radius = radius;
	}

	calcArea() {
		return Math.PI * this.radius ** 2;
	}

	calcPerimeter() {
		return 2 * Math.PI * this.radius;
	}
}

// Liskov Substitution Principle
// Contoh penggunaan inheritance untuk mendukung Liskov Substitution Principle
// Class Square adalah turunan dari class Rectangle, sehingga bisa digunakan sebagai pengganti Rectangle

class Bird {
	layEggs(): void {
		console.log("Laying eggs");
	}
}

class FlyingBird extends Bird {
	fly(): void {
		console.log("Flying");
	}
}

class SwimmingBird extends Bird {
	swim(): void {
		console.log("Swimming");
	}
}

class RunningBird extends Bird {
	run(): void {
		console.log("Running");
	}
}

class Pidgeon extends FlyingBird {
	fly(): void {
		console.log("Pidgeon is flying");
	}
}

class Penguin extends SwimmingBird {
	swim(): void {
		console.log("Penguin is swimming");
	}
}

class Ostrich extends RunningBird {
	run(): void {
		console.log("Ostrich is running");
	}
}

class Duck extends Bird {
	layEggs(): void {
		console.log("Duck is laying eggs");
	}
}

// Interface Segregation Principle
// Sebuah class yang memiliki banyak tanggung jawab bisa dipecah
// menjadi beberapa interface yang lebih spesifik

interface IPrinter {
	print(): void;
}

interface IScanner {
	scan(): void;
}

// class MultiFunctionPrinter yang mengimplementasikan kedua interface IPrinter dan IScanner
// dan mengkomposisi fungsionalitas dari kedua interface tersebut
class MultiFunctionPrinter implements IPrinter, IScanner {
	print(): void {
		console.log("Printing document...");
	}

	scan(): void {
		console.log("Scanning document...");
	}
}

// Dependency Inversion Principle
// Contoh penggunaan dependency injection untuk mendukung Dependency Inversion Principle
// Class ReportGenerator bergantung pada interface IReportFormatter, bukan pada implementasi konkret/class

interface IReportFormatter {
	format(data: any): string;
}

class ReportGenerator {
	private formatter: IReportFormatter;

	constructor(formatter: IReportFormatter) {
		this.formatter = formatter;
	}

	generateReport(data: any): string {
		return this.formatter.format(data);
	}
}

class PDFReportFormatter implements IReportFormatter {
	format(data: any): string {
		return `PDF Report: ${JSON.stringify(data)}`;
	}
}

class HTMLReportFormatter implements IReportFormatter {
	format(data: any): string {
		return `<html><body>HTML Report: ${JSON.stringify(data)}</body></html>`;
	}
}

// Usage
const pdfFormatter = new PDFReportFormatter();
const reportGeneratorPDF = new ReportGenerator(pdfFormatter);
console.log(
	reportGeneratorPDF.generateReport({
		title: "Annual Report",
		content: "This is the content of the annual report.",
	}),
);
