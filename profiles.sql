-e CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS 30474 BEGIN NEW.updated_at = NOW(); RETURN NEW; END; 30474 LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY Public profiles are viewable by everyone
ON profiles FOR SELECT TO PUBLIC;

CREATE POLICY Users can update their own profile
ON profiles FOR UPDATE TO auth USING (auth.uid() = id);
