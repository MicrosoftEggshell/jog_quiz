#include <ostream>
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <iomanip>
#include <sstream>

using namespace std;

struct question {
	string question, a, b, c, d;
};

string quote(const string & str){
	stringstream ss;
	ss << std::quoted(str);
	return ss.str();
}

std::ostream & operator<<(std::ostream & os, const question & q) {
    os << "{";
	os << "\"question\":" << quote(q.question) << ",";
	os << "\"a\":" << quote(q.a) << ",";
	os << "\"b\":" << quote(q.b) << ",";
	os << "\"c\":" << quote(q.c) << ",";
	os << "\"d\":" << quote(q.d) << "";
    os << "}";
	return os;
}

int main() {
	ifstream file("Jog_tesztkerdesek.txt");
	file.exceptions(ifstream::failbit | ifstream::badbit);

	cout << "OK File" << endl;

	string line;
	char state = 'x';
	string key;
	int number, last = 0;
	vector<question> vec(147);
	auto * que = &vec[0];
	while (getline(file, line)) {
		cout << key << endl;
		switch (state) {
		case 'q':
		    que->question = line;
			state = 'a';
			break;
		case 'a':
			que->a = line.substr(line.find(' '));
			state = 'b';
			break;
		case 'b':
			que->b = line.substr(line.find(' '));
			state = 'c';
			break;
		case 'c':
			que->c = line.substr(line.find(' '));
			state = 'd';
			break;
		case 'd':
			que->d = line.substr(line.find(' '));
			state = 'x';
			break;
		case 'x':
			if (number == 147) {
				goto print;
			}
			if (sscanf(line.c_str(), "%d.\n", &number) == 1 && number == last + 1) {
				last = number;
				key = to_string(number);
				que = &vec[number-1];
				state = 'q';
			}
			break;
		}
	}

	cout << "OK Read" << endl;
	print:  
	ofstream data_json;
	data_json.open("data.json");
    data_json << "{\"" << 1 << "\":" << vec[0];
	for(int i = 1; i < vec.size(); ++i) {
		data_json << ",\"" << (i + 1) << "\":" << vec[i];
	}
	data_json << "}";
	data_json.close();
	return 0;
}
