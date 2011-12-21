package co.geomati.netcdf.ceam;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import co.geomati.netcdf.IcosDomain;
import co.geomati.netcdf.Institution;
import co.geomati.netcdf.TimeUnit;
import co.geomati.netcdf.dataset.Dataset;
import co.geomati.netcdf.dataset.DatasetDoubleVariable;
import co.geomati.netcdf.dataset.Station;
import co.geomati.netcdf.dataset.TimeSerie;

public class CEAMDataset implements Dataset, TimeSerie, Station {

	private Variable variable;
	private ArrayList<Integer> timestamps;

	public CEAMDataset(Variable variable, ArrayList<Integer> seconds) {
		this.variable = variable;
		this.timestamps = seconds;
	}

	@Override
	public IcosDomain getIcosDomain() {
		return IcosDomain.ENVIRONMENT;
	}

	@Override
	public Institution getInstitution() {
		return Institution.CEAM;
	}

	@Override
	public co.geomati.netcdf.dataset.DatasetVariable getMainVariable() {
		return new DatasetDoubleVariable() {

			@Override
			public String getUnits() {
				return variable.getUnits();
			}

			@Override
			public String getStandardName() {
				return variable.getName();
			}

			@Override
			public String getName() {
				return variable.getName();
			}

			@Override
			public String getLongName() {
				return variable.getLongName();
			}

			@Override
			public Number getFillValue() {
				return null;
			}

			@Override
			public List<Double> getData() {
				ArrayList<Object> values = variable.getValues();
				ArrayList<Double> ret = new ArrayList<Double>();
				for (Object sample : values) {
					ret.add((Double) sample);
				}
				return ret;
			}
		};
	}

	@Override
	public TimeUnit getTimeUnits() {
		return TimeUnit.SECOND;
	}

	@Override
	public Date getReferenceDate() {
		return new Date(0);
	}

	@Override
	public List<Integer> getTimeStamps() {
		return timestamps;
	}

	@Override
	public int getStationCount() {
		return 1;
	}
}
