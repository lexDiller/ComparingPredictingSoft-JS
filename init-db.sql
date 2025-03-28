CREATE TABLE IF NOT EXISTS carcass_analysis (
    carcass_id VARCHAR(255) PRIMARY KEY,
    weight_legacy FLOAT,
    rea_legacy FLOAT,
    yieldgrade_legacy FLOAT,
    yieldgrade_legacy_grade VARCHAR(10),
    adjpyg_legacy FLOAT,
    actualpyg_legacy FLOAT,
    marbling_legacy FLOAT,
    marbling_legacy_grade VARCHAR(10),
    marbling_legacy_quality VARCHAR(10),
    reheight_mm_legacy FLOAT,
    rebroad_mm_legacy FLOAT,
    rea_predict FLOAT,
    yieldgrade_predict FLOAT,
    yieldgrade_predict_grade VARCHAR(10),
    adjpyg_predict FLOAT,
    actualpyg_predict FLOAT,
    marbling_predict FLOAT,
    marbling_predict_grade VARCHAR(10),
    marbling_predict_quality VARCHAR(10),
    main_axis_length_predict FLOAT,
    perpendicular_axis_length_predict FLOAT
);

-- Insert sample data
INSERT INTO carcass_analysis VALUES
('CARCASS001', 800.5, 14.2, 3.1, 'A', 3.2, 3.3, 4.5, 'Prime', 'High', 120.5, 85.2, 14.5, 3.0, 'A', 3.1, 3.2, 4.6, 'Prime', 'High', 130.5, 90.1),
('CARCASS002', 750.2, 13.8, 2.9, 'B', 3.0, 3.1, 4.2, 'Choice', 'Medium', 118.2, 82.8, 14.0, 2.8, 'B', 2.9, 3.0, 4.3, 'Choice', 'Medium', 125.8, 88.4),
('CARCASS003', 820.7, 14.5, 3.2, 'A', 3.3, 3.4, 4.7, 'Prime', 'High', 122.3, 86.5, 14.7, 3.1, 'A', 3.2, 3.3, 4.8, 'Prime', 'High', 132.1, 91.3);