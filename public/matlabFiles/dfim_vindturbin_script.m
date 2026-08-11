clear
clc

InputTable = readtable('Parameters.csv');
disp(InputTable)
R_s = InputTable(1,"Var2").Variables;
L_s = InputTable(2, "Var2").Variables;
R_r = InputTable(3, "Var2").Variables;
L_r = InputTable(4, "Var2").Variables;
L_m = InputTable(5, "Var2").Variables;
Wind_nom = InputTable(6,"Var2").Variables;
PairsOfPoles = InputTable(7, "Var2").Variables;
Pm = InputTable(8, "Var2").Variables;
Vm = InputTable(9, "Var2").Variables;
Pw = InputTable(10, "Var2").Variables;
Vg = InputTable(11, "Var2").Variables;
eff = InputTable(12, "Var2").Variables;
dia = InputTable(13, "Var2").Variables;
genMomentOfInertia = InputTable(14, "Var2").Variables;
gbRatio = InputTable(15, "Var2").Variables;

rad = dia/2;
f = 50;
rpm_n = 60*f/PairsOfPoles;

Tbase = Pm/(rpm_n*2*pi/60);
Ibase = Pm /(sqrt(3)*Vm);
Rbase = Vm*Vm/Pm;


Rs = R_s/Rbase;
Ls = L_s/Rbase;
Rr = R_r/Rbase;
Lr = L_r/Rbase;
Lm = L_m/Rbase;

Vdc = 1.634*Vm;

%Wind speed
Wind_ci = nthroot((1*(1-eff/100)*Pm)/(0.4*1.225*pi*rad^2), 3);
Wind_co = Wind_nom*(2.05 - 0.05*Pm/10e5);

%Turbine +  generator inertia H
J_turb = 3*0.212*2.95*(dia/2.08)^(2+2.13);
H = (J_turb/gbRatio^2+genMomentOfInertia)*(f*2*pi/PairsOfPoles)^2/(2*Pw);
