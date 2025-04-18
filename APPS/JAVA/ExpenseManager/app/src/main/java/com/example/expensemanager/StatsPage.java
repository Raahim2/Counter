package com.example.expensemanager;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.anychart.AnyChart;
import com.anychart.AnyChartView;
import com.anychart.chart.common.dataentry.DataEntry;
import com.anychart.chart.common.dataentry.ValueDataEntry;
import com.anychart.chart.common.listener.Event;
import com.anychart.chart.common.listener.ListenersInterface;
import com.anychart.charts.Cartesian;
import com.anychart.charts.Pie;
import com.anychart.charts.Scatter;
import com.anychart.core.cartesian.series.Column;
import com.anychart.core.scatter.series.Line;
import com.anychart.core.scatter.series.Marker;
import com.anychart.data.Mapping;
import com.anychart.enums.Align;
import com.anychart.enums.Anchor;
import com.anychart.enums.HoverMode;
import com.anychart.enums.LegendLayout;
import com.anychart.enums.MarkerType;
import com.anychart.enums.Position;
import com.anychart.enums.TooltipDisplayMode;
import com.anychart.enums.TooltipPositionMode;
import com.anychart.graphics.vector.GradientKey;
import com.anychart.graphics.vector.LinearGradientStroke;
import com.anychart.graphics.vector.SolidFill;
import com.anychart.graphics.vector.Stroke;
import com.anychart.graphics.vector.text.HAlign;
import com.google.android.material.tabs.TabLayout;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;



public class StatsPage extends AppCompatActivity {
    TabLayout tabLayout;
    AnyChartView anyChartView;


    int currentmonth;
    Expense [] expenses;
    private static final String FILE_NAME = "expenses.json";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_stats_page);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        anyChartView = findViewById(R.id.chart1);

        tabLayout = findViewById(R.id.tab);


        LocalDate today = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            today = LocalDate.now();
            currentmonth = today.getMonthValue();
        }

        try {
            expenses = filterexpense(currentmonth , FILE_NAME);
        } catch (IOException | JSONException e) {
            Log.e("MSG", "Error loading expenses", e);
        }

        pie(anyChartView , expenses);



        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {

            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                anyChartView.clear(); // Clear any existing chart
                if (tab.getText().equals("Pie Chart")) {
                    pie(anyChartView, expenses);
                } else if (tab.getText().equals("Bar Chart")) {
                    bar(anyChartView, expenses);
                } else if (tab.getText().equals("Scatter")) {
                    scatter(anyChartView, expenses);
                } else if (tab.getText().equals("Line Chart")) {
                    Toast.makeText(StatsPage.this, tab.getText(), Toast.LENGTH_SHORT).show();
                } else if (tab.getText().equals("3d Chart")) {
                    Toast.makeText(StatsPage.this, tab.getText(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }


        });

    }


    public void pie(AnyChartView anyChartView  , Expense[] expenses){

        Pie pie = AnyChart.pie();

        pie.setOnClickListener(new ListenersInterface.OnClickListener(new String[]{"x", "value"}) {
            @Override
            public void onClick(Event event) {
                Toast.makeText(StatsPage.this, event.getData().get("x") + ":" + event.getData().get("value"), Toast.LENGTH_SHORT).show();
            }
        });

        List<DataEntry> data = new ArrayList<>();
        for (int i = 0; i < expenses.length; i++) {
            data.add(new ValueDataEntry(expenses[i].getType(), expenses[i].getAmount()));
        }

        pie.data(data);

        pie.title("Category Wise Money Spend");

        pie.labels().position("outside");

        pie.legend().title().enabled(true);
        pie.legend().title()
                .text("Retail channels")
                .padding(0d, 0d, 10d, 0d);

        pie.legend()
                .position("center-bottom")
                .itemsLayout(LegendLayout.HORIZONTAL)
                .align(Align.CENTER);

        anyChartView.setChart(pie);
    }

    public void bar(AnyChartView anyChartView  , Expense[] expenses){
        Cartesian cartesian = AnyChart.column();

        List<DataEntry> data = new ArrayList<>();
        for (int i = 0; i < expenses.length; i++) {
            data.add(new ValueDataEntry(expenses[i].getType(), expenses[i].getAmount()));
        }

        Column column = cartesian.column(data);

        column.tooltip()
                .titleFormat("{%X}")
                .position(Position.CENTER_BOTTOM)
                .anchor(Anchor.CENTER_BOTTOM)
                .offsetX(0d)
                .offsetY(5d)
                .format("${%Value}{groupsSeparator: }");

        cartesian.animation(true);
        cartesian.title("Top expenses this month");

        cartesian.yScale().minimum(0d);

        cartesian.yAxis(0).labels().format("${%Value}{groupsSeparator: }");

        cartesian.tooltip().positionMode(TooltipPositionMode.POINT);
        cartesian.interactivity().hoverMode(HoverMode.BY_X);

        cartesian.xAxis(0).title("Product");
        cartesian.yAxis(0).title("Revenue");

        anyChartView.setChart(cartesian);
    }

    public void scatter(AnyChartView anyChartView  , Expense[] expenses){

        Scatter scatter = AnyChart.scatter();

        scatter.animation(true);

        scatter.title("System interruptions");

        List<DataEntry> data = new ArrayList<>();

        for (int i = 0; i < expenses.length; i++) {
            String[] parts = expenses[i].getDate().split("/");
            int firstNumber = Integer.parseInt(parts[0]);
            data.add(new ValueDataEntry(firstNumber, expenses[i].getAmount()));
        }


        scatter.xScale()
                .minimum(1.5d)
                .maximum(5.5d);
        scatter.yScale()
                .minimum(40d)
                .maximum(100d);

        scatter.yAxis(0).title("Waiting time between interruptions (Min)");
        scatter.xAxis(0)
                .title("Interruption duration (Min)")
                .drawFirstLabel(false)
                .drawLastLabel(false);

        scatter.interactivity()
                .hoverMode(HoverMode.BY_SPOT)
                .spotRadius(30d);

        scatter.tooltip().displayMode(TooltipDisplayMode.UNION);

        Marker marker = scatter.marker(data);
        marker.type(MarkerType.TRIANGLE_UP)
                .size(4d);
        marker.hovered()
                .size(7d)
                .fill(new SolidFill("gold", 1d))
                .stroke("anychart.color.darken(gold)");
        marker.tooltip()
                .hAlign(HAlign.START)
                .format("Waiting time: ${%Value} min.\\nDuration: ${%X} min.");

        Line scatterSeriesLine = scatter.line(data);

        GradientKey gradientKey[] = new GradientKey[] {
                new GradientKey("#abcabc", 0d, 1d),
                new GradientKey("#cbacba", 40d, 1d)
        };
        LinearGradientStroke linearGradientStroke = new LinearGradientStroke(0d, null, gradientKey, null, null, true, 1d, 2d);
        scatterSeriesLine.stroke(linearGradientStroke, 3d, null, (String) null, (String) null);

        anyChartView.setChart(scatter);
    }

    public Expense[] filterexpense(int month , String FILENAME) throws IOException, JSONException {
        String json = loadJSONFromInternalStorage(FILENAME);

        JSONArray arr = new JSONArray(json);
        List<Expense> filteredExpenses = new ArrayList<>();

        for (int i = 0; i < arr.length(); i++) {
            JSONObject obj = arr.getJSONObject(i);

            String date = obj.getString("date");
            String[] parts = date.split("/");

            int monthfromjson = Integer.parseInt(parts[1]);

            if (monthfromjson == month) {
                String task = obj.getString("task");
                String type = obj.getString("type");
                int amount = obj.getInt("amount");
                filteredExpenses.add(new Expense(task, date, amount, type));
            }
        }

        return filteredExpenses.toArray(new Expense[0]);
    }

    public String loadJSONFromInternalStorage(String FILENAME) throws IOException {
        FileInputStream fis = openFileInput(FILENAME);
        int size = fis.available();
        byte[] buffer = new byte[size];
        fis.read(buffer);
        fis.close();
        return new String(buffer, StandardCharsets.UTF_8);
    }


    public void movetoHomePage(View v) {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }
    public void movetoAddExpensePage(View v) {
        Intent intent = new Intent(this, AddExpense.class);
        startActivity(intent);
    }
    public void movetoCalenderPage(View v) {
        Intent intent = new Intent(this, CalenderPage.class);
        startActivity(intent);
    }
    public void movetoStatsPage(View v) {
        Intent intent = new Intent(this, StatsPage.class);
        startActivity(intent);
    }
    public void movetoSettingsPage(View v) {
        Intent intent = new Intent(this, SettingsPage.class);
        startActivity(intent);
    }
}